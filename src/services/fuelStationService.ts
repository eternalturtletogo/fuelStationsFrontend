import axios from "axios";

export type Pump = {
    id: number;
    fuel_type: string;
    price: number;
    available: boolean;
};

export type FuelStationDTO = {
    _id?: string;
    id: string;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    pumps: Pump[];
    [key: string]: any;
};

let fetch = axios.create({
    headers: {
        "x-api-key": `${import.meta.env.VITE_API_KEY}`,
    },
});

const BASE_URL = import.meta.env.VITE_BASE_URL as string | "http://localhost:3300";

export const getFuelStations = async (): Promise<FuelStationDTO[]> => {
    const response = await fetch.get(`${BASE_URL}/fuel-stations`);
    return response.data;
};

export const getFuelStation = async (id: string): Promise<FuelStationDTO> => {
    const response = await fetch.get(`${BASE_URL}/fuel-stations/${id}`);
    return response.data;
};

export const createFuelStation = async (fuelStation: any): Promise<FuelStationDTO> => {
    const response = await fetch.post(`${BASE_URL}/fuel-stations`, fuelStation);
    return response.data;
};

export const updateStationName = async (
    stationId: string,
    name: string
): Promise<FuelStationDTO> => {
    const response = await fetch.patch(`${BASE_URL}/fuel-stations/${stationId}/name`, { name });
    return response.data;
};

export const updateFuelStationPrices = async (
    stationId: string,
    pumps: any[]
): Promise<FuelStationDTO> => {
    const response = await fetch.patch(
        `${BASE_URL}/fuel-stations/${stationId}/pump-price`,
        pumps.map((p) => ({ id: p.id, price: p.price }))
    );
    return response.data;
};

export const deleteFuelStation = async (stationId: string) => {
    const response = await fetch.delete(`${BASE_URL}/fuel-stations/${stationId}`);
    return response.data;
};
