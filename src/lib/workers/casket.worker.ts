import '../data/itemAliases';

import { roll } from 'e';
import { EliteMimicTable, type ItemBank, MasterMimicTable } from 'oldschooljs';

import type { CasketWorkerArgs } from '.';
import { ClueTiers } from '../clues/clueTiers';

if (global.prisma) {
	throw new Error('Prisma is loaded in the casket worker!');
}

export default async ({ clueTierID, quantity }: CasketWorkerArgs): Promise<[ItemBank, string]> => {
	const clueTier = ClueTiers.find(tier => tier.id === clueTierID)!;
	const loot = clueTier.table.roll(quantity);
	let mimicNumber = 0;
	if (clueTier.mimicChance) {
		const table = clueTier.name === 'Master' ? MasterMimicTable : EliteMimicTable;
		for (let i = 0; i < quantity; i++) {
			if (roll(clueTier.mimicChance)) {
				loot.add(table.roll());
				mimicNumber++;
			}
		}
	}

	const opened = `Loot from ${quantity} ${clueTier.name} Casket${quantity > 1 ? 's' : ''}${
		mimicNumber > 0 ? ` and ${mimicNumber} mimic${mimicNumber > 1 ? 's' : ''}` : ''
	}`;

	return [loot.toJSON(), opened];
};
