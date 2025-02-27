import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// TilesRenderer, controls and attribution imports
import { TilesPlugin, TilesRenderer, TilesAttributionOverlay, EnvironmentControls } from '3d-tiles-renderer/r3f';
import { CesiumIonAuthPlugin, UpdateOnChangePlugin, GLTFExtensionsPlugin, ReorientationPlugin } from '3d-tiles-renderer/plugins';

// Plugins
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// R3F, DREI and LEVA imports
import { Canvas } from '@react-three/fiber';
import { Environment, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { useControls } from 'leva';

const dracoLoader = new DRACOLoader().setDecoderPath( 'https://www.gstatic.com/draco/v1/decoders/' );

function App() {

	const levaParams = {
		assetId: {
			value: '1415196',
			options: {
				'Aerometrex - San Francisco': '1415196',
				'Aerometrex - Denver': '354307',
				'New York City 3D Buildings': '75343',
				'Melbourne Photogrammetry': '69380',
				// 'Cesium HQ': '40866',
				'Melbourne Point Cloud': '43978',
				'Montreal Point Cloud': '28945',
			},
		},
	};

	const { assetId } = useControls( levaParams );
	return (
		<Canvas
			frameloop='demand'
			camera={ {
				position: [ 300, 300, 300 ],
				near: 1,
				far: 1e5,
			} }
			style={ {
				width: '100%',
				height: '100%',
				position: 'absolute',
				margin: 0,
				left: 0,
				top: 0,
			} }
		>
			{/*
				3D Tiles renderer tile set
				Use a "key" property to ensure the tiles renderer gets recreated when the api token or asset change
			*/}
			<TilesRenderer key={ assetId }>
				<TilesPlugin plugin={ CesiumIonAuthPlugin } args={ { apiToken: import.meta.env.VITE_ION_KEY, assetId } } />
				<TilesPlugin plugin={ GLTFExtensionsPlugin } dracoLoader={ dracoLoader } />
				<TilesPlugin plugin={ ReorientationPlugin } />
				<TilesPlugin plugin={ UpdateOnChangePlugin } />

				<TilesAttributionOverlay />
			</TilesRenderer>

			{/* Controls */}
			<EnvironmentControls enableDamping={ true } maxDistance={ 5000 } />

			{/* other r3f staging */}
			<Environment
				preset="sunset" background={ true }
				backgroundBlurriness={ 0.9 }
				environmentIntensity={ 1 }
			/>
			<GizmoHelper alignment="bottom-right">
				<GizmoViewport />
			</GizmoHelper>

		</Canvas>
	);

}

createRoot( document.getElementById( 'root' ) ).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

