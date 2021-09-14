import { log, _ } from '../deps.ts';

interface Launch {
	flightNumber: number;
	mission: string;
	rocket: string;
	customers: Array<string>;
	launchDate: number;
	upcoming: boolean;
	success?: boolean;
	target?: string;
}

const launches = new Map<number, Launch>();

export async function downloadLaunchData() {
	log.info('Downloading launch data...');
	const response = await fetch('https://api.spacexdata.com/v3/launches', {
		method: 'GET',
	});

	if (!response.ok) {
		log.warning('Problem downloading launch data.');
		throw new Error('Launch data download failed');
	}
	const launchData = await response.json();

	for (const launch of launchData) {
		const payloads = launch['rocket']['second_stage']['payloads'];
		const customers = _.flatMap(payloads, (payload: any) => {
			return payload['customers'];
		});

		const flightData = {
			flightNumber: launch['flight_number'],
			mission: launch['mission_name'],
			rocket: launch['rocket']['rocket_name'],
			customers: customers,
			launchDate: launch['launch_date_unix'],
			upcoming: launch['upcoming'],
			success: launch['launch_success'],
		};

		launches.set(flightData.flightNumber, flightData);
	}
}

await downloadLaunchData();
log.info(`Downloaded data for ${launches.size} SpaceX launches.`);

export function getAllLaunches() {
	return Array.from(launches.values());
}

export function getOneLaunch(id: number) {
	if (launches.has(id)) {
		return launches.get(id);
	}
	return null;
}

export function removeOneLaunch(id: number) {
	const aborted = launches.get(id);
	if (aborted) {
		aborted.upcoming = false;
		aborted.success = false;
	}
	return aborted;
}

export function addOneLaunch(data: Launch) {
	launches.set(
		data.flightNumber,
		Object.assign(data, {
			upcoming: true,
			customers: ['Zero to Mastery', 'NASA'],
		})
	);
}