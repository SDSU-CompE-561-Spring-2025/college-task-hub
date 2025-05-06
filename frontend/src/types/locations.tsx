export type LocationCreate = {
	street: string;
	city: string;
	state: string;
	zipcode: number;
};

export type LocationType = LocationCreate & {
	id: number;
};
