import { log, BufReader, join, parse, _ } from '../deps.ts';

// interface Planet {
// 	[key: string]: string;
// }

type Planet = Record<string, string>;

const loadPlanetsData = async () => {
	const path = join(Deno.cwd(), './src/data/kepler_exoplanets_nasa.csv');

	const file = await Deno.open(path);
	const bufReader = new BufReader(file);
	const result = await parse(bufReader, {
		skipFirstRow: true,
		comment: '#',
	});

	Deno.close(file.rid);
	return result;
};

export const findHabitablePlanets = (planets: Array<Planet>) => {
	const filteredPlanets = (planets as Array<Planet>).filter((planet) => {
		const planetaryRadius = Number(planet['koi_prad']);
		const stellarMass = Number(planet['koi_smass']);
		const stellarRadius = Number(planet['koi_srad']);

		return (
			planet['koi_disposition'] === 'CONFIRMED' &&
			planetaryRadius > 0.5 &&
			planetaryRadius < 1.5 &&
			stellarMass > 0.78 &&
			stellarMass < 1.04 &&
			stellarRadius > 0.99 &&
			stellarRadius < 1.01
		);
	});

	return filteredPlanets.map((planet) => {
		return _.pick(
			planet,
			'koi_disposition',
			'koi_prad',
			'koi_smass',
			'koi_srad',
			'kepler_name',
			'koi_count',
			'koi_steff'
		);
	});
};

const result = await loadPlanetsData();
const planets = await findHabitablePlanets(result as Array<Planet>);
log.info(`${planets.length} habitable plantes found.`);

export function getAllPlanets() {
	return planets;
}
