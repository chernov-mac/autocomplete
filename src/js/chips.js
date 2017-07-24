/*
*    JavaScript Autocomplete
*    Author: Vladimir Chernov
*    For KeepSolid Summer Internship 2017
*/
/*jslint esversion: 6 */

import { Autocomplete, AutocompleteDefaults } from "./autocomplete.js";

export const ChipsDefaults = {
	maxChipsNumber: 4, // 0 - without limit
	maxChipsText: 'Maximum number of chips reached.',
	isSelectedText: 'This option is already selected.',
	selectOnlyOnce: true,
	removable: true,
	removeBtnText: '&times;',
	toggleOnSelect: false // override selectOnlyOnce (as false)
};

export class Chips extends Autocomplete {

	constructor(input, data, options) {

		super(input, data, options);
		this.options = Object.assign({}, ChipsDefaults, this.options);
		this.chips = []; // array of strings
		this.chipsList = []; // DOM element div.chips-list
		this.chipsElem; // DOM element div.autocomplete.chips

		this.setChipsList();
		this.markSelectedOptions();
	}

	setChipsList() {
		this.ac.classList.add('chips');
		this.chipsElem = this.ac;
		this.chipsList = document.createElement('div');
		this.chipsList.classList.add('chips-list');
		this.chipsElem.insertBefore(this.chipsList, this.fc);

		if (this.chips.length) { this.updateChipsList(); }

		this.chipsList.addEventListener('click', this.chipsClick.bind(this));
	}

	updateChipsList() {
		this.removeMessage(this.ac, 'error', 'isSelected');

		let removeBtn = this.options.removable ? ' <span class="remove">&times;</span>' : '';
		let classList = this.options.removable ? 'chip removable' : 'chip';

		let list = '';
		this.chips.forEach((chip) => {
			list += `<span class="${classList}" data-val="${chip}">${chip}${removeBtn}</span>`;
		});

		this.chipsList.innerHTML = list;
		this.markSelectedOptions();
		this.isMaxAmount();

		this.options.onSelect && this.options.onSelect.call(this, this.chips);
	}

	addChip(str) {
		this.chips[this.chips.length] = str;
		this.updateChipsList();
	}

	removeChip(str) {
		let chip = this.chipsList.querySelector('[data-val="'+str+'"]');

		for(let i = 0; i < this.chips.length; i++) {
			if (this.chips[i] === str) {
				this.chips.splice(i, 1);
				break;
			}
		}
		this.updateChipsList();
	}

	markSelectedOptions() {
		let options = this.suggestions.querySelectorAll('.option');
		options.forEach((option) => {
			let value = option.getAttribute('data-val');
			if (this.chips.includes(value)) {
				this.markOption(option);
			} else {
				this.unmarkOption(option);
			}
		});
	}

	markOption(option) {
		option.classList.add('selected');
		option.removeAttribute('tabindex');
	}

	unmarkOption(option) {
		option.classList.remove('selected');
		let index = this.resultData.indexOf(option.getAttribute('data-val'));
		option.setAttribute('tabindex', index);
	}

	toggleMarking(option) {
		if (option.classList.contains('selected')) {
			this.unmarkOption(option);
		} else {
			this.markOption(option);
		}
	}

	isMaxAmount() {
		if (this.options.maxChipsNumber && this.chips.length >= this.options.maxChipsNumber) {
			this.showMessage(this.ac, this.chipsList, this.options.maxChipsText, 'error', 'maxChipsNumber');
			return true;
		} else {
			this.removeMessage(this.ac, 'error', 'maxChipsNumber');
			return false;
		}
	}

	selectOption(option) {
		let str = option.getAttribute('data-val');

		if (!this.isMaxAmount() && this.isAvailable(str)) {
			this.addChip(str);
		}
		this.markSelectedOptions();
    }

	toggleOption(option) {
		let str = option.getAttribute('data-val');

		if (!this.isMaxAmount() && this.isAvailable(str)) {
			this.addChip(str);
		} else {
			this.removeChip(str);
		}

		this.markSelectedOptions();
	}

	isAvailable(str) {
		if (this.isSelected(str) && this.options.selectOnlyOnce) {
			this.showMessage(this.ac, this.chipsList, this.options.isSelectedText, 'error', 'isSelected');
			return false;
		}
		return true;
	}

	isSelected(str) {
		return this.chips.includes(str) ? true : false;
	}

	chipsClick(event) {
		if (event.target.classList.contains('remove')) {
			let value = event.target.parentNode.getAttribute('data-val');
			this.removeChip(value);
		}
	}

	onInput() {
		super.onInput();
		this.markSelectedOptions();
	}

	onClose() {
		super.onClose();
		this.markSelectedOptions();
	}

	onSuggestionsClick(event) {
		this.removeMessage(this.ac, 'error', 'isSelected');

		if (this.suggestions.contains(event.target) && !this.options.toggleOnSelect) {
			this.selectOption(event.target);
		} else if (this.suggestions.contains(event.target) && this.options.toggleOnSelect) {
			this.toggleOption(event.target);
		}

		this.isMaxAmount();
		this.input.focus();
	}

}
