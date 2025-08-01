import { type CommandRunOptions, formatDuration, randomVariation, stringMatches } from '@oldschoolgg/toolkit/util';
import { ApplicationCommandOptionType } from 'discord.js';
import { increaseNumByPercent, reduceNumByPercent } from 'e';
import { itemID } from 'oldschooljs';

import type { OSBMahojiCommand } from '@oldschoolgg/toolkit/discord-util';
import { userhasDiaryTier } from '../../lib/diaries.js';
import { QuestID } from '../../lib/minions/data/quests';
import { DiaryID } from '../../lib/minions/types.js';
import { determineMiningTime } from '../../lib/skilling/functions/determineMiningTime';
import { miningCapeOreEffect, miningGloves, pickaxes, varrockArmours } from '../../lib/skilling/functions/miningBoosts';
import { sinsOfTheFatherSkillRequirements } from '../../lib/skilling/functions/questRequirements';
import Mining from '../../lib/skilling/skills/mining';
import type { Ore } from '../../lib/skilling/types';
import type { GearBank } from '../../lib/structures/GearBank';
import type { MiningActivityTaskOptions } from '../../lib/types/minions';
import addSubTaskToActivityTask from '../../lib/util/addSubTaskToActivityTask';
import { calcMaxTripLength } from '../../lib/util/calcMaxTripLength';
import { formatSkillRequirements, itemNameFromID } from '../../lib/util/smallUtils.js';
import { motherlodeMineCommand } from '../lib/abstracted_commands/motherlodeMineCommand';

export function determineMiningTrip({
	gearBank,
	ore,
	maxTripLength,
	isPowermining,
	quantityInput,
	hasKaramjaMedium,
	randomVariationEnabled = true
}: {
	gearBank: GearBank;
	ore: Ore;
	maxTripLength: number;
	isPowermining: boolean;
	quantityInput: number | undefined;
	hasKaramjaMedium: boolean;
	randomVariationEnabled?: boolean;
}) {
	const boosts = [];
	// Invisible mining level, dosen't help equip pickaxe etc
	let miningLevel = gearBank.skillsAsLevels.mining;
	if (ore.minerals && miningLevel >= 60) {
		boosts.push('+7 invisible Mining lvls at the Mining guild');
		miningLevel += 7;
	}
	// Checks if user own Celestial ring or Celestial signet
	if (gearBank.hasEquippedOrInBank(['Celestial ring (uncharged)'])) {
		boosts.push('+4 invisible Mining lvls for Celestial ring');
		miningLevel += 4;
	}
	// Default bronze pickaxe, last in the array
	let currentPickaxe = pickaxes[pickaxes.length - 1];
	boosts.push(`**${currentPickaxe.ticksBetweenRolls}** ticks between rolls for ${itemNameFromID(currentPickaxe.id)}`);

	// For each pickaxe, if they have it, give them its' bonus and break.
	for (const pickaxe of pickaxes) {
		if (!gearBank.hasEquippedOrInBank([pickaxe.id]) || gearBank.skillsAsLevels.mining < pickaxe.miningLvl) continue;
		currentPickaxe = pickaxe;
		boosts.pop();
		boosts.push(`**${pickaxe.ticksBetweenRolls}** ticks between rolls for ${itemNameFromID(pickaxe.id)}`);
		break;
	}

	let glovesEffect = 0;
	if (gearBank.skillsAsLevels.mining >= 60) {
		for (const glove of miningGloves) {
			if (!gearBank.hasEquipped(glove.id) || !glove.Depletions[ore.name]) continue;
			glovesEffect = glove.Depletions[ore.name];
			if (glovesEffect) {
				boosts.push(
					`mining gloves saves ${ore.name} from becoming depleted **${glovesEffect}x** ${glovesEffect > 1 ? 'times' : 'time'} using ${itemNameFromID(glove.id)}`
				);
				break;
			}
		}
	}

	let armourEffect = 0;
	for (const armour of varrockArmours) {
		if (!gearBank.hasEquippedOrInBank(armour.id) || !armour.Percentages[ore.name]) continue;
		armourEffect = armour.Percentages[ore.name];
		if (armourEffect) {
			boosts.push(`**${armourEffect}%** chance to mine an extra ore using ${itemNameFromID(armour.id)}`);
			break;
		}
	}

	let goldSilverBoost = false;
	if (gearBank.skillsAsLevels.crafting >= 99 && (ore.name === 'Gold ore' || ore.name === 'Silver ore')) {
		goldSilverBoost = true;
		boosts.push(`**70%** faster ${ore.name} banking for 99 Crafting`);
	}

	let miningCapeEffect = 0;
	if (gearBank.hasEquippedOrInBank([itemID('Mining cape')]) && miningCapeOreEffect[ore.name]) {
		miningCapeEffect = miningCapeOreEffect[ore.name];
		if (miningCapeEffect) {
			boosts.push(`**${miningCapeEffect}%** chance to mine an extra ore using Mining cape`);
		}
	}

	if (ore.bankingTime === 0 && ore.name !== 'Daeyalt essence rock') {
		isPowermining = false;
	}

	if (isPowermining) {
		boosts.push('**Powermining**');
	}

	// Calculate the time it takes to mine specific quantity or as many as possible
	const [timeToMine, newQuantity] = determineMiningTime({
		quantity: quantityInput,
		gearBank,
		ore,
		ticksBetweenRolls: currentPickaxe.ticksBetweenRolls,
		glovesEffect,
		armourEffect,
		miningCapeEffect,
		powermining: isPowermining,
		goldSilverBoost,
		miningLvl: miningLevel,
		maxTripLength,
		hasKaramjaMedium
	});

	const duration = timeToMine;

	const fakeDurationMin =
		quantityInput && randomVariationEnabled ? randomVariation(reduceNumByPercent(duration, 25), 20) : duration;
	const fakeDurationMax =
		quantityInput && randomVariationEnabled ? randomVariation(increaseNumByPercent(duration, 25), 20) : duration;

	if (ore.name === 'Gem rock' && gearBank.hasEquipped('Amulet of glory')) {
		boosts.push('3x success rate for having an Amulet of glory equipped');
	}

	if (Number.isNaN(newQuantity) || newQuantity < 1) {
		throw new Error(`Invalid quantity ${newQuantity} for mining ${ore.name}`);
	}

	return {
		duration,
		quantity: newQuantity,
		boosts,
		fakeDurationMin: Math.floor(fakeDurationMin),
		fakeDurationMax: Math.floor(fakeDurationMax),
		isPowermining
	};
}

export const mineCommand: OSBMahojiCommand = {
	name: 'mine',
	description: 'Send your minion to mine things.',
	attributes: {
		requiresMinion: true,
		requiresMinionNotBusy: true,
		examples: ['/mine name:Runite ore']
	},
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: 'name',
			description: 'The thing you want to mine.',
			required: true,
			autocomplete: async (value: string) => {
				return [...Mining.Ores.map(i => i.name), Mining.MotherlodeMine.name]
					.filter(name => (!value ? true : name.toLowerCase().includes(value.toLowerCase())))
					.map(i => ({
						name: i,
						value: i
					}));
			}
		},
		{
			type: ApplicationCommandOptionType.Integer,
			name: 'quantity',
			description: 'The quantity you want to mine (optional).',
			required: false,
			min_value: 1
		},
		{
			type: ApplicationCommandOptionType.Boolean,
			name: 'powermine',
			description: 'Set this to true to powermine. Higher xp/hour, No loot (default false, optional).',
			required: false
		}
	],
	run: async ({
		options,
		userID,
		channelID
	}: CommandRunOptions<{ name: string; quantity?: number; powermine?: boolean }>) => {
		const user = await mUserFetch(userID);
		const { quantity, powermine } = options;

		const motherlodeMine =
			stringMatches(Mining.MotherlodeMine.name, options.name) ||
			Mining.MotherlodeMine.aliases?.some(a => stringMatches(a, options.name));

		if (motherlodeMine) {
			return motherlodeMineCommand({ user, channelID, quantity });
		}
		const ore = Mining.Ores.find(
			ore =>
				stringMatches(ore.id, options.name) ||
				stringMatches(ore.name, options.name) ||
				ore.aliases?.some(a => stringMatches(a, options.name))
		);

		if (!ore) {
			return `Thats not a valid ore to mine. Valid ores are ${Mining.Ores.map(ore => ore.name).join(', ')}, or ${
				Mining.MotherlodeMine.name
			}.`;
		}

		if (user.skillsAsLevels.mining < ore.level) {
			return `${user.minionName} needs ${ore.level} Mining to mine ${ore.name}.`;
		}

		// Check for daeyalt shard requirements.
		const hasDaeyaltReqs = user.hasSkillReqs(sinsOfTheFatherSkillRequirements);
		if (ore.name === 'Daeyalt essence rock') {
			if (!hasDaeyaltReqs) {
				return `To mine ${ore.name}, you need ${formatSkillRequirements(sinsOfTheFatherSkillRequirements)}.`;
			}
			if (user.QP < 125) {
				return `To mine ${ore.name}, you need at least 125 Quest Points.`;
			}
		}

		if (ore.name === 'Tainted essence chunk') {
			if (!user.user.finished_quest_ids.includes(QuestID.DesertTreasureII)) {
				return 'You need to have completed the Desert Treasure II quest to access the scar essence mine.';
			}
		}

		const hasKaramjaMedium =
			ore.name === 'Gem rock' ? (await userhasDiaryTier(user, [DiaryID.Karamja, 'medium']))[0] : false;
		const res = determineMiningTrip({
			gearBank: user.gearBank,
			ore,
			maxTripLength: calcMaxTripLength(user, 'Mining'),
			isPowermining: !!powermine,
			quantityInput: quantity,
			hasKaramjaMedium
		});

		await addSubTaskToActivityTask<MiningActivityTaskOptions>({
			oreID: ore.id,
			userID: userID.toString(),
			channelID: channelID.toString(),
			quantity: res.quantity,
			iQty: options.quantity ? options.quantity : undefined,
			powermine: res.isPowermining,
			duration: res.duration,
			fakeDurationMax: res.fakeDurationMax,
			fakeDurationMin: res.fakeDurationMin,
			type: 'Mining'
		});

		let response = `${user.minionName} is now mining ${ore.name} until your minion ${
			quantity ? `mined ${quantity}x or gets tired` : 'is satisfied'
		}, it'll take ${
			quantity
				? `between ${formatDuration(res.fakeDurationMin)} **and** ${formatDuration(res.fakeDurationMax)}`
				: formatDuration(res.duration)
		} to finish.`;

		if (res.boosts.length > 0) {
			response += `\n\n**Boosts:** ${res.boosts.join(', ')}.`;
		}

		return response;
	}
};
