import { assertEquals, assertNotEquals } from './test_deps.ts';

// Deno.test('short example test', () => {
// 	assertEquals('deno', 'deno');
// 	assertNotEquals({ runtime: 'deno' }, { runtime: 'node' });
// });

// Deno.test({
// 	name: 'long example test',
// 	ignore: Deno.build.os === 'linux',
// 	fn() {
// 		assertEquals('deno', 'deno');
// 		assertNotEquals({ runtime: 'deno' }, { runtime: 'node' });
// 	},
// });

// Deno.test({
// 	name: 'async ops leak',
// 	sanitizeOps: false,
// 	fn() {
// 		setTimeout(log.info, 10000);
// 	},
// });

// Deno.test({
// 	name: 'resource leak',
// 	sanitizeResources: false,
// 	async fn() {
// 		await deno.open('./models/planets.ts');
// 	},
// });

import { findHabitablePlanets } from './models/planets.ts';

const HABITABLE_PLANET = {
	koi_disposition: 'CONFIRMED',
	koi_prad: '1',
	koi_srad: '1',
	koi_smass: '1',
};

const NOT_CONFIRMED = {
	koi_disposition: 'FALSE POSITIVE',
};

const TOO_LARGE_PLANETARY_RADIUS = {
	koi_disposition: 'CONFIRMED',
	koi_prad: '1.5',
	koi_srad: '1',
	koi_smass: '1',
};

const TOO_LARGE_SOLAR_RADIUS = {
	koi_disposition: 'CONFIRMED',
	koi_prad: '1',
	koi_srad: '1.01',
	koi_smass: '1',
};

const TOO_LARGE_SOLAR_MASS = {
	koi_disposition: 'CONFIRMED',
	koi_prad: '1',
	koi_srad: '1',
	koi_smass: '1.04',
};

Deno.test('filter only habitable planets', () => {
	const filtered = findHabitablePlanets([
		HABITABLE_PLANET,
		NOT_CONFIRMED,
		TOO_LARGE_PLANETARY_RADIUS,
		TOO_LARGE_SOLAR_RADIUS,
		TOO_LARGE_SOLAR_MASS,
	]);
	log.info(filtered);

	assertEquals(filtered, [HABITABLE_PLANET]);
});
