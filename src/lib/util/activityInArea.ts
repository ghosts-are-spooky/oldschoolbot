import { Monsters, resolveItems } from 'oldschooljs';

import { soteSkillRequirements } from '../skilling/functions/questRequirements';
import { courses } from '../skilling/skills/agility';
import butterflyNettingCreatures from '../skilling/skills/hunter/creatures/butterflyNetting';
import type {
	ActivityTaskData,
	AgilityActivityTaskOptions,
	HunterActivityTaskOptions,
	MonsterActivityTaskOptions,
	PickpocketActivityTaskOptions,
	WoodcuttingActivityTaskOptions
} from '../types/minions';

export enum WorldLocations {
	Priffdinas = 0,
	World = 1
}

const WorldLocationsChecker = [
	{
		area: WorldLocations.Priffdinas,
		checker: (user: MUser, activity: ActivityTaskData) => {
			if (user.hasSkillReqs(soteSkillRequirements) && user.QP >= 150) {
				if (['Gauntlet', 'Zalcano'].includes(activity.type)) return true;
				if (
					activity.type === 'MonsterKilling' &&
					[Monsters.DarkBeast.id, Monsters.PrifddinasElf.id].includes(
						(activity as MonsterActivityTaskOptions).mi
					)
				) {
					return true;
				}
				if (
					activity.type === 'Pickpocket' &&
					(activity as PickpocketActivityTaskOptions).monsterID === Monsters.PrifddinasElf.id
				) {
					return true;
				}
				if (
					activity.type === 'Agility' &&
					(activity as AgilityActivityTaskOptions).courseID ===
						courses.find(c => c.name === 'Prifddinas Rooftop Course')!.id
				) {
					return true;
				}
				if (
					activity.type === 'Woodcutting' &&
					resolveItems(['Teak logs', 'Mahogany logs']).includes(
						(activity as WoodcuttingActivityTaskOptions).logID
					) &&
					(activity as WoodcuttingActivityTaskOptions).forestry === true
				) {
					return true;
				}
			}
			if (
				activity.type === 'Hunter' &&
				(activity as HunterActivityTaskOptions).creatureID ===
					butterflyNettingCreatures.find(c => c.name === 'Crystal impling')!.id
			) {
				return true;
			}

			return false;
		}
	}
];

export default function activityInArea(user: MUser, activity: ActivityTaskData) {
	for (const checkLocation of WorldLocationsChecker) {
		if (checkLocation.checker(user, activity)) return checkLocation.area;
	}
	return WorldLocations.World;
}
