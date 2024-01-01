import { Vector2 } from 'three';

export class PointerTracker {

	constructor() {

		this.buttons = 0;
		this.pointerType = null;
		this.pointerOrder = [];
		this.previousPositions = {};
		this.pointerPositions = {};
		this.startPositions = {};
		this.hoverPosition = new Vector2();
		this.hoverSet = false;

	}

	setHoverEvent( e ) {

		if ( e.pointerType === 'mouse' ) {

			this.hoverPosition.set( e.clientX, e.clientY );
			this.hoverSet = true;

		}

	}

	getLatestPoint( target ) {

		if ( ! this.hoverSet ) {

			return null;

		} else if ( this.pointerType !== null ) {

			this.getCenterPoint( target );

		} else {

			target.copy( this.hoverPosition );

		}

		return target;

	}

	addPointer( e ) {

		const id = e.pointerId;
		const position = new Vector2( e.clientX, e.clientY );
		this.pointerOrder.push( id );
		this.pointerPositions[ id ] = position;
		this.previousPositions[ id ] = position.clone();
		this.startPositions[ id ] = position.clone();

		if ( this.getPointerCount() === 1 ) {

			this.pointerType = e.pointerType;
			this.buttons = e.buttons;

		}

	}

	updatePointer( e ) {

		const id = e.pointerId;
		if ( ! ( id in this.pointerPositions ) ) {

			return false;

		}

		const position = this.pointerPositions[ id ];
		this.previousPositions[ id ].copy( position );
		this.pointerPositions[ id ].set( e.clientX, e.clientY );
		return true;

	}

	deletePointer( e ) {

		const id = e.pointerId;
		const pointerOrder = this.pointerOrder;
		pointerOrder.splice( pointerOrder.indexOf( id ), 1 );
		delete this.pointerPositions[ id ];
		delete this.previousPositions[ id ];
		delete this.startPositions[ id ];

		if ( this.getPointerCount.length === 0 ) {

			this.buttons = 0;
			this.pointerType = null;

		}

	}

	getPointerCount() {

		return this.pointerOrder.length;

	}

	getCenterPoint( target, pointerPositions = this.pointerPositions ) {

		const pointerOrder = this.pointerOrder;
		if ( this.getPointerCount() === 1 || this.getPointerType() === 'mouse' ) {

			const id = pointerOrder[ 0 ];
			target.copy( pointerPositions[ id ] );
			return target;

		} else if ( this.getPointerCount() === 2 ) {

			const id0 = this.pointerOrder[ 0 ];
			const id1 = this.pointerOrder[ 1 ];

			const p0 = this.pointerPositions[ id0 ];
			const p1 = this.pointerPositions[ id1 ];

			target.addVectors( p0, p1 ).multiplyScalar( 0.5 );
			return target;

		}

		return null;

	}

	getPreviousCenterPoint( target ) {

		return this.getCenterPoint( target, this.previousPositions );

	}

	getPointerDistance( pointerPositions = this.pointerPositions ) {

		if ( this.getPointerCount() <= 1 || this.getPointerType() === 'mouse' ) {

			return 0;

		}

		const { pointerOrder } = this;
		const id0 = pointerOrder[ 0 ];
		const id1 = pointerOrder[ 1 ];

		const p0 = pointerPositions[ id0 ];
		const p1 = pointerPositions[ id1 ];

		return p0.distanceTo( p1 );

	}

	getPreviousPointerDistance() {

		return this.getPointerDistance( this.previousPositions );

	}

	getPointerType() {

		return this.pointerType;

	}

	getPointerButtons() {

		return this.buttons;

	}

	isLeftClicked() {

		return Boolean( this.buttons & 1 );

	}

	isRightClicked() {

		return Boolean( this.buttons & 2 );

	}

}