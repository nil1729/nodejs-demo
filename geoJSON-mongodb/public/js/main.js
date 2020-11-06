mapboxgl.accessToken =
	'pk.eyJ1IjoibmlsYW5qYW4tZGViIiwiYSI6ImNrYTNheGxpNjBpZzQzdHBuMnA3ZzY0ejEifQ.m2MKnF-xokCqK59FDMf7Sw';
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/outdoors-v11',
	zoom: 5,
	center: [77.216721, 28.6448], //longitude and latitude
});

const loadMapWithStores = (stores) => {
	map.on('load', function () {
		map.addLayer({
			id: 'points',
			type: 'symbol',
			source: {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: stores,
				},
			},
			layout: {
				'icon-image': '{icon}-15',
				'icon-size': 1.5,
				'text-field': '{storeId}',
				'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
				'text-offset': [0, 0.9],
				'text-anchor': 'top',
			},
		});
	});
};

const getStores = async () => {
	try {
		const res = await fetch('/api/v1/stores');
		const data = await res.json();
		const stores = data.data.map((store) => {
			return {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: store.location.coordinates,
				},
				properties: {
					storeId: store.storeId,
					icon: 'shop',
				},
			};
		});
		loadMapWithStores(stores);
	} catch (error) {
		console.log(error);
	}
};

getStores();
