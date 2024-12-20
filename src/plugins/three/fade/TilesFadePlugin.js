import { Matrix4, Vector3, Quaternion } from 'three';
import { FadeManager } from './FadeManager.js';

const HAS_POPPED_IN = Symbol( 'HAS_POPPED_IN' );
const _fromPos = new Vector3();
const _toPos = new Vector3();
const _fromQuat = new Quaternion();
const _toQuat = new Quaternion();
const _scale = new Vector3();

function onTileVisibilityChange( scene, tile, visible ) {

	// ensure the tiles are marked as visible on visibility toggle since
	// it's possible we disable them when adjusting visibility based on frustum
	scene.visible = true;

	const fadeManager = this._fadeManager;
	if ( fadeManager.isFadingOut( scene ) ) {

		this._fadingOutCount --;

	}

	if ( ! visible ) {

		this._fadingOutCount ++;
		fadeManager.fadeOut( scene );

	} else {

		// if this is a root renderable tile and this is the first time rendering in
		// then pop it in
		const isRootRenderableTile = tile.__depthFromRenderedParent === 1;
		if ( isRootRenderableTile ) {

			if ( tile[ HAS_POPPED_IN ] || this.fadeRootTiles ) {

				this._fadeManager.fadeIn( scene );

			}

			tile[ HAS_POPPED_IN ] = true;


		} else {

			this._fadeManager.fadeIn( scene );

		}

	}

}

function onLoadModel( scene, tile ) {

	this._fadeManager.prepareObject( scene );
	this._tileMap.set( scene, tile );

}

function onDisposeModel( scene ) {

	this._fadeManager.deleteObject( scene );
	this._tileMap.delete( scene );

}

function onFadeComplete( object, visible ) {

	if ( ! visible ) {

		// now that the tile is hidden we can run the built-in setTileVisible function for the tile
		const tile = this._tileMap.get( object );
		this.tiles.invokeOnePlugin( plugin => plugin !== this && plugin.setTileVisible && plugin.setTileVisible( tile, false ) );

		this._fadingOutCount --;

	}

}

function onAddCamera( camera ) {

	this._prevCameraTransforms.set( camera, new Matrix4() );

}

function onDeleteCamera( camera ) {

	this._prevCameraTransforms.delete( camera );

}

function onUpdateBefore() {

	const fadeManager = this._fadeManager;
	const tiles = this.tiles;

	// store the tiles renderer state before the tiles update so we can check
	// whether fading started or stopped completely
	this._fadingBefore = fadeManager.fadeCount;
	this._displayActiveTiles = tiles.displayActiveTiles;

	// we need to display all active tiles in this case so we don't fade tiles in
	// when moving from off screen
	tiles.displayActiveTiles = true;

}

function onUpdateAfter() {

	const fadeManager = this._fadeManager;
	const displayActiveTiles = this._displayActiveTiles;
	const fadingBefore = this._fadingBefore;
	const tiles = this.tiles;
	const prevCameraTransforms = this._prevCameraTransforms;
	const tileMap = this._tileMap;
	const lruCache = tiles.lruCache;
	const cameras = tiles.cameras;

	// reset state
	tiles.displayActiveTiles = displayActiveTiles;

	// update fades
	fadeManager.update();

	// fire an event
	const fadingAfter = fadeManager.fadeCount;
	if ( fadingBefore !== 0 && fadingAfter !== 0 ) {

		tiles.dispatchEvent( { type: 'fade-change' } );
		tiles.dispatchEvent( { type: 'force-rerender' } );

	}

	// update the visibility of tiles based on visibility since we must use
	// the active tiles for rendering fade
	if ( ! displayActiveTiles ) {

		tiles.visibleTiles.forEach( t => {

			// if a tile is fading out then it may not be traversed and thus will not have
			// the frustum flag set correctly.
			const scene = t.cached.scene;
			if ( fadeManager.isFadingOut( scene ) ) {

				scene.visible = true;

			} else {

				scene.visible = t.__inFrustum;

			}

		} );

	}

	if ( this.maximumFadeOutTiles < this._fadingOutCount ) {

		// determine whether all the rendering cameras are moving
		// quickly so we can adjust how tiles fade accordingly
		let isMovingFast = true;
		cameras.forEach( camera => {

			if ( ! prevCameraTransforms.has( camera ) ) {

				return;

			}

			const currMatrix = camera.matrixWorld;
			const prevMatrix = prevCameraTransforms.get( camera );

			currMatrix.decompose( _toPos, _toQuat, _scale );
			prevMatrix.decompose( _fromPos, _fromQuat, _scale );

			const angleTo = _toQuat.angleTo( _fromQuat );
			const positionTo = _toPos.distanceTo( _fromPos );

			// if rotation is moving > 0.25 radians per frame or position is moving > 0.1 units
			// then we are considering the camera to be moving too fast to notice a faster / abrupt fade
			isMovingFast = isMovingFast && ( angleTo > 0.25 || positionTo > 0.1 );

		} );

		if ( isMovingFast ) {

			fadeManager.completeAllFades();

		}

	}

	// track the camera movement so we can use it for next frame
	cameras.forEach( camera => {

		prevCameraTransforms.get( camera ).copy( camera.matrixWorld );

	} );

	// prevent faded tiles from being unloaded
	fadeManager.forEachObject( scene => {

		lruCache.markUsed( tileMap.get( scene ) );

	} );

}

export class TilesFadePlugin {

	get fadeDuration() {

		return this._fadeManager.duration;

	}

	set fadeDuration( value ) {

		this._fadeManager.duration = Number( value );

	}

	get fadingTiles() {

		return this._fadeManager.fadeCount;

	}

	constructor( options ) {

		options = {

			maximumFadeOutTiles: 50,
			fadeRootTiles: false,
			fadeDuration: 250,
			...options,

		};

		this.name = 'FADE_TILES_PLUGIN';
		this.priority = - 1;

		this.tiles = null;
		this._fadeManager = new FadeManager();
		this._prevCameraTransforms = null;
		this._tileMap = null;
		this._fadingOutCount = 0;

		this.maximumFadeOutTiles = options.maximumFadeOutTiles;
		this.fadeRootTiles = options.fadeRootTiles;
		this.fadeDuration = options.fadeDuration;

	}

	init( tiles ) {

		const fadeManager = this._fadeManager;
		fadeManager.onFadeSetStart = () => {

			tiles.dispatchEvent( { type: 'fade-start' } );
			tiles.dispatchEvent( { type: 'force-rerender' } );

		};

		fadeManager.onFadeSetComplete = () => {

			tiles.dispatchEvent( { type: 'fade-end' } );
			tiles.dispatchEvent( { type: 'force-rerender' } );

		};

		fadeManager.onFadeComplete = onFadeComplete.bind( this );

		this.tiles = tiles;
		this._fadeManager = fadeManager;
		this._tileMap = new Map();
		this._prevCameraTransforms = new Map();

		tiles.cameras.forEach( camera => {

			this._prevCameraTransforms.set( camera, new Matrix4() );

		} );

		tiles.forEachLoadedModel( ( scene, tile ) => {

			onLoadModel.call( this, scene, tile );

		} );

		this._onLoadModel = e => onLoadModel.call( this, e.scene, e.tile );
		this._onDisposeModel = e => onDisposeModel.call( this, e.scene );
		this._onAddCamera = e => onAddCamera.call( this, e.camera );
		this._onDeleteCamera = e => onDeleteCamera.call( this, e.camera );
		this._onUpdateBefore = () => onUpdateBefore.call( this );
		this._onUpdateAfter = () => onUpdateAfter.call( this );

		tiles.addEventListener( 'load-model', this._onLoadModel );
		tiles.addEventListener( 'dispose-model', this._onDisposeModel );
		tiles.addEventListener( 'add-camera', this._onAddCamera );
		tiles.addEventListener( 'delete-camera', this._onDeleteCamera );
		tiles.addEventListener( 'update-before', this._onUpdateBefore );
		tiles.addEventListener( 'update-after', this._onUpdateAfter );

	}

	setTileVisible( tile, visible ) {

		const scene = tile.cached.scene;
		const wasFading = this._fadeManager.isFading( scene );
		onTileVisibilityChange.call( this, scene, tile, visible );

		// if a tile was already fading then it's already marked as visible and in the scene
		if ( wasFading ) {

			return true;

		}

		// cancel the visibility change trigger because we're fading and will call this after
		// fade completes.
		const isFading = this._fadeManager.isFading( scene );
		if ( ! visible && isFading ) {

			return true;

		}

		return false;

	}

	dispose() {

		const tiles = this.tiles;

		this._fadeManager.completeAllFades();

		tiles.removeEventListener( 'load-model', this._onLoadModel );
		tiles.removeEventListener( 'dispose-model', this._onDisposeModel );
		tiles.removeEventListener( 'add-camera', this._onAddCamera );
		tiles.removeEventListener( 'delete-camera', this._onDeleteCamera );
		tiles.removeEventListener( 'update-before', this._onUpdateBefore );
		tiles.removeEventListener( 'update-after', this._onUpdateAfter );
		tiles.forEachLoadedModel( scene => {

			this._fadeManager.deleteObject( scene );
			this._tileMap.delete( scene );
			scene.visible = true;

		} );

	}

}
