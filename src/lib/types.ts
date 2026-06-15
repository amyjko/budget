export type Category = 'eat' | 'groc' | 'misc' | 'health' | 'fun' | 'inc';

export type Entry = {
	day: number;
	category: Category;
	amount: number;
};

export type History = Entry[];
