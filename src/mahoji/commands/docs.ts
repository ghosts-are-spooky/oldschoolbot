import { ApplicationCommandOptionType, CommandRunOptions } from 'mahoji';

import { docArticles } from '../../lib/docsHelper';
import { stringMatches } from '../../lib/util/cleanString';
import { OSBMahojiCommand } from '../lib/util';

export const docsCommand: OSBMahojiCommand = {
	name: 'docs',
	description: 'Search the BSO wiki.',
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: 'query',
			description: 'Your search query.',
			required: true,
			autocomplete: async (value: string) => {
				return docArticles
					.filter(i => (!value ? true : i.name.toLowerCase().includes(value.toLowerCase())))
					.map(i => ({
						name: i.name,
						value: i.name
					}));
			}
		}
	],
	run: async ({ options }: CommandRunOptions<{ query: string }>) => {
		const foundArticle = docArticles.find(item => stringMatches(item.name, options.query));
		console.log(foundArticle);
		console.log(docArticles);
		if (!foundArticle) return 'That article could not be found.';
		return `https://bso-wiki.oldschool.gg/${foundArticle.value}`;
	}
};