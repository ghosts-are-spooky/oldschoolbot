import { StoreBitfield } from '@oldschoolgg/toolkit/util';
import { Bank } from 'oldschooljs';

import type { CanvasImage } from '@/lib/canvas/canvasUtil';
import type { Skills } from '@/lib/types';
import { BitField, PerkTier } from '../../constants';

export type BankBackground = {
	image: CanvasImage | null;
	id: number;
	name: string;
	available: boolean;
	collectionLogItemsNeeded?: Bank;
	perkTierNeeded?: PerkTier;
	gpCost?: number;
	itemCost?: Bank;
	repeatImage?: CanvasImage | null;
	bitfield?: BitField;
	sacValueRequired?: number;
	skillsNeeded?: Skills;
	transparent?: true;
	alternateImages?: { id: number }[];
	storeBitField?: StoreBitfield;
} & (
	| {
			hasPurple: true;
			purpleImage: CanvasImage | null;
	  }
	| {
			hasPurple?: null;
	  }
);

const backgroundImages: BankBackground[] = [
	{
		id: 1,
		name: 'Default',
		image: null,
		available: true
	},
	{
		id: 2,
		name: 'Swampman',
		image: null,
		available: false,
		storeBitField: StoreBitfield.HasSetTwoDarkPermanentBankBackgrounds
	},
	{
		id: 3,
		name: 'Lumbridge',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 10_000_000,
		storeBitField: StoreBitfield.HasSetTwoDarkPermanentBankBackgrounds
	},
	{
		id: 4,
		name: 'Karamja',
		image: null,
		available: false
	},
	{
		id: 5,
		name: 'Edgeville',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 10_000_000,
		storeBitField: StoreBitfield.HasSetTwoDarkPermanentBankBackgrounds
	},
	{
		id: 6,
		name: 'Barrows',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Six,
		gpCost: 10_000_000,
		storeBitField: StoreBitfield.HasSetTwoDarkPermanentBankBackgrounds
	},
	{
		id: 7,
		name: 'Bandos',
		image: null,
		available: true,
		collectionLogItemsNeeded: new Bank({
			'Armadyl hilt': 1,
			'Zamorak hilt': 1,
			'Bandos hilt': 1,
			'Saradomin hilt': 1,
			'Armadyl helmet': 1,
			'Armadyl chestplate': 1,
			'Armadyl chainskirt': 1,
			'Saradomin sword': 1,
			"Saradomin's light": 1,
			'Armadyl crossbow': 1,
			'Bandos chestplate': 1,
			'Bandos tassets': 1,
			'Bandos boots': 1,
			'Steam battlestaff': 1,
			'Zamorakian spear': 1,
			'Staff of the dead': 1,
			'Pet general graardor': 1,
			"Pet k'ril tsutsaroth": 1,
			"Pet kree'arra": 1,
			'Pet zilyana': 1,
			Nexling: 1,
			'Ancient hilt': 1,
			'Nihil horn': 1,
			'Zaryte vambraces': 1,
			'Torva full helm (damaged)': 1,
			'Torva platebody (damaged)': 1,
			'Torva platelegs (damaged)': 1,
			'Nihil shard': 1
		}),
		itemCost: new Bank({
			'Armadyl godsword': 1,
			'Zamorak godsword': 1,
			'Bandos godsword': 1,
			'Saradomin godsword': 1,
			'Ancient godsword': 1
		}),
		gpCost: 100_000_000
	},
	{
		id: 8,
		name: 'Corporeal Beast',
		image: null,
		available: true,
		collectionLogItemsNeeded: new Bank({
			'Spirit shield': 4,
			'Holy elixir': 4,
			'Spectral sigil': 1,
			'Arcane sigil': 1,
			'Elysian sigil': 1,
			'Pet dark core': 1,
			'Jar of spirits': 1
		}),
		itemCost: new Bank({
			'Spectral spirit shield': 1,
			'Arcane spirit shield': 1,
			'Elysian spirit shield': 1
		}),
		gpCost: 100_000_000
	},
	{
		id: 9,
		name: 'Casket',
		image: null,
		available: true,
		collectionLogItemsNeeded: new Bank({
			'Large spade': 1,
			'Clueless scroll': 1,
			'Heavy casket': 1,
			'Scroll sack': 1
		}),
		gpCost: 100_000_000
	},
	{
		id: 10,
		name: 'Nightmare',
		image: null,
		available: true,
		collectionLogItemsNeeded: new Bank({
			'Little nightmare': 1,
			'Jar of dreams': 1,
			'Nightmare staff': 1,
			"Inquisitor's great helm": 1,
			"Inquisitor's hauberk": 1,
			"Inquisitor's plateskirt": 1,
			"Inquisitor's mace": 1,
			'Eldritch orb': 1,
			'Harmonised orb': 1,
			'Volatile orb': 1,
			'Slepey tablet': 1,
			'Parasitic egg': 1
		}),
		itemCost: new Bank({
			'Eldritch orb': 1,
			'Harmonised orb': 1,
			'Volatile orb': 1
		}),
		gpCost: 100_000_000
	},
	{
		id: 11,
		name: 'Dark',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 10_000_000
	},
	{
		id: 12,
		name: 'Morytania',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Five,
		gpCost: 10_000_000,
		storeBitField: StoreBitfield.HasSetOneNaturePermanentBankBackgrounds
	},
	{
		id: 13,
		name: 'Grass',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 10_000_000,
		storeBitField: StoreBitfield.HasSetOneNaturePermanentBankBackgrounds
	},
	{
		id: 14,
		name: 'CoX',
		image: null,
		available: true,
		bitfield: BitField.HasPermanentEventBackgrounds,
		hasPurple: true,
		purpleImage: null,
		storeBitField: StoreBitfield.HasDynamicCoXBackgroundPermanentBankBackgrounds
	},
	{
		id: 15,
		name: 'OSB',
		image: null,
		available: true,
		bitfield: BitField.HasPermanentEventBackgrounds,
		storeBitField: StoreBitfield.HasSetTwoDarkPermanentBankBackgrounds
	},
	{
		id: 16,
		name: 'Wilderness',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		collectionLogItemsNeeded: new Bank({
			'Dragon pickaxe': 1,
			'Dragon med helm': 1,
			'Kbd heads': 1,
			'Draconic visage': 1,
			'Prince black dragon': 1,
			'Dragon 2h sword': 1,
			'Pet chaos elemental': 1,
			'Malediction shard 1': 1,
			'Odium shard 1': 1,
			'Malediction shard 2': 1,
			'Odium shard 2': 1,
			Fedora: 1,
			'Malediction shard 3': 1,
			'Odium shard 3': 1,
			"Scorpia's offspring": 1,
			'Treasonous ring': 1,
			'Venenatis spiderling': 1,
			'Tyrannical ring': 1,
			'Callisto cub': 1,
			'Ring of the gods': 1,
			"Vet'ion jr.": 1
		}),
		itemCost: new Bank({
			'Dragon pickaxe': 1,
			'Dragon med helm': 1,
			'Draconic visage': 1,
			'Dragon 2h sword': 1,
			'Odium ward ': 1,
			'Malediction ward': 1,
			'Treasonous ring': 1,
			'Tyrannical ring': 1,
			'Ring of the gods': 1
		}),
		gpCost: 100_000_000,
		storeBitField: StoreBitfield.HasSetTwoDarkPermanentBankBackgrounds
	},
	{
		id: 17,
		name: 'Grand Exchange',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 2_147_483_647,
		sacValueRequired: 2_147_483_647,
		storeBitField: StoreBitfield.HasSetOneNaturePermanentBankBackgrounds
	},
	{
		id: 18,
		name: 'Falador Park',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		collectionLogItemsNeeded: new Bank({
			Tangleroot: 1
		}),
		gpCost: 100_000_000,
		skillsNeeded: {
			farming: 99
		},
		storeBitField: StoreBitfield.HasSetOneNaturePermanentBankBackgrounds
	},
	{
		id: 19,
		name: 'Pets',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 20_000_000,
		transparent: true,
		storeBitField: StoreBitfield.HasSetThreeTransparentAnimalsPermanentBankBackgrounds
	},
	{
		id: 20,
		name: 'Transparent',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 20_000_000,
		transparent: true
	},
	{
		id: 21,
		name: 'Smokey',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 20_000_000,
		transparent: true,
		storeBitField: StoreBitfield.HasSetThreeTransparentAnimalsPermanentBankBackgrounds
	},
	{
		id: 22,
		name: 'Nieve',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 20_000_000,
		storeBitField: StoreBitfield.HasSetFourGirlsPermanentBankBackgrounds
	},
	{
		id: 23,
		name: 'ToB',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 20_000_000,
		transparent: true,
		hasPurple: true,
		purpleImage: null,
		storeBitField: StoreBitfield.HasDynamicToBBackgroundPermanentBankBackgrounds
	},
	{
		id: 24,
		name: 'Zilyana',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Three,
		gpCost: 20_000_000,
		storeBitField: StoreBitfield.HasSetFourGirlsPermanentBankBackgrounds
	},
	{
		id: 25,
		name: 'Zilyana Transparent',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Three,
		gpCost: 20_000_000,
		transparent: true,
		storeBitField: StoreBitfield.HasSetFourGirlsPermanentBankBackgrounds
	},
	{
		id: 26,
		name: 'Konar Transparent',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 20_000_000,
		transparent: true,
		storeBitField: StoreBitfield.HasSetFourGirlsPermanentBankBackgrounds
	},
	{
		id: 27,
		name: 'Konar',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 20_000_000,
		storeBitField: StoreBitfield.HasSetFourGirlsPermanentBankBackgrounds
	},
	{
		id: 28,
		name: 'Sandwich Lady',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 20_000_000,
		transparent: true,
		storeBitField: StoreBitfield.HasSetFourGirlsPermanentBankBackgrounds
	},
	{
		id: 29,
		name: 'Farmer Jane (Dynamic)',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 500_000,
		alternateImages: [{ id: 1 }],
		storeBitField: StoreBitfield.HasDynamicFarmingBackgroundPermanentBankBackgrounds
	},
	{
		id: 30,
		name: 'Farmer Jane (Transparent, Dynamic)',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 500_000,
		transparent: true,
		alternateImages: [{ id: 1 }],
		storeBitField: StoreBitfield.HasDynamicFarmingBackgroundPermanentBankBackgrounds
	},
	{
		id: 31,
		name: 'Swans (Transparent)',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 500_000,
		transparent: true,
		storeBitField: StoreBitfield.HasSetThreeTransparentAnimalsPermanentBankBackgrounds
	},
	{
		id: 32,
		name: 'Troll',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 500_000
	},
	{
		id: 33,
		name: 'Christmas',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 500_000
	},
	{
		id: 35,
		name: 'Jad',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 500_000
	},
	{
		id: 36,
		name: 'Halloween Logo',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 500_000
	},
	{
		id: 503,
		name: 'Halloween Manor',
		image: null,
		available: true,
		perkTierNeeded: PerkTier.Four,
		gpCost: 10_000_000,
		storeBitField: StoreBitfield.HalloweenItemIconPack
	}
];

export function getBankBgById(bgId: number) {
	const result = backgroundImages.find(bgi => bgi.id === bgId);
	return result ?? backgroundImages[0];
}

export default backgroundImages;
