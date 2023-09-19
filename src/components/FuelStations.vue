<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer">
            <h1>Stations</h1>
            <v-expansion-panels v-model="createPanel">
                <v-expansion-panel value="create">
                    <v-expansion-panel-title color="blue-grey-darken-1">
                        <v-row no-gutters>
                            <v-col class="d-flex justify-start">New station</v-col>
                        </v-row>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-form>
                            <v-text-field
                                density="compact"
                                v-model="form.id"
                                label="ID"
                            ></v-text-field>
                            <v-text-field
                                density="compact"
                                v-model="form.name"
                                label="Name"
                            ></v-text-field>
                            <v-text-field
                                density="compact"
                                v-model="form.address"
                                label="Address"
                            ></v-text-field>
                            <v-text-field
                                density="compact"
                                v-model="form.city"
                                label="City"
                            ></v-text-field>
                            <div class="d-flex">
                                <v-text-field
                                    v-model="form.latitude"
                                    label="Latitude"
                                    type="number"
                                ></v-text-field>
                                <v-text-field
                                    v-model="form.longitude"
                                    label="Longitude"
                                    type="number"
                                ></v-text-field>
                            </div>

                            <div class="d-flex pl-2">
                                <div
                                    class="d-flex flex-column justify-space-evenly"
                                    v-for="pump of form.pumps"
                                >
                                    <span
                                        @click="pump.available = !pump.available"
                                        class="pa-1 text-center"
                                        :class="{
                                            'bg-green': pump.available,
                                            'bg-red': !pump.available,
                                        }"
                                        style="border: 1px solid lightgray; cursor: pointer"
                                        >{{ pumpTypeToSymbol[pump.fuel_type] }}</span
                                    >
                                    <input
                                        @keydown.space.stop
                                        type="number"
                                        style="width: 60px; line-height: 2"
                                        class="ma-1 pl-2 bg-grey-lighten-3"
                                        size="10"
                                        v-model="pump.price"
                                    />
                                </div>
                            </div>

                            <v-btn
                                @click="submitCreateFuelStationForm"
                                color="blue-grey-darken-1"
                                class="my-2 mx-2"
                                >Create</v-btn
                            >
                        </v-form>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-divider></v-divider>
            <v-list width="w-100">
                <v-list-item
                    :ripple="false"
                    v-for="station of fuelStations"
                    :value="station.id"
                    @click="panToStationCoordinates(station)"
                >
                    <div v-if="editedStationId != station.id">
                        <v-list-item-title>{{ station.name }}</v-list-item-title>
                        <v-list-item-subtitle class="d-flex flex-column">
                            <div>{{ station.address }}</div>
                            <div>{{ station.city }}</div>
                            <div class="d-flex">
                                <div
                                    class="d-flex flex-column justify-space-evenly"
                                    v-for="pump of station.pumps"
                                >
                                    <span
                                        class="pa-1 text-center"
                                        :class="{
                                            'bg-green': pump.available,
                                            'bg-red': !pump.available,
                                        }"
                                        style="border: 1px solid lightgray"
                                        >{{ pumpTypeToSymbol[pump.fuel_type] }}</span
                                    >
                                    <span class="font-weight-bold pa-1 text-center">{{
                                        pump.price
                                    }}</span>
                                </div>
                            </div>
                        </v-list-item-subtitle>
                    </div>
                    <div @click.stop="" v-else>
                        <div class="d-flex">
                            <v-text-field
                                density="compact"
                                v-model="station.name"
                                @keydown.space.stop
                            ></v-text-field>
                            <v-btn
                                @click.stop="updateStationName(station.id, station.name); editedStationId = ''; panToStationCoordinates(station)"
                                color="blue"
                                class="my-1 ml-1"
                                size="small"
                                >save</v-btn
                            >
                        </div>
                        <v-list-item-subtitle class="d-flex flex-column">
                            <div>{{ station.address }}</div>
                            <div>{{ station.city }}</div>
                            <div class="d-flex align-end">
                                <div class="d-flex">
                                    <div
                                        class="d-flex flex-column justify-space-evenly"
                                        v-for="pump of station.pumps"
                                    >
                                        <span
                                            class="pa-1 text-center"
                                            :class="{
                                                'bg-green': pump.available,
                                                'bg-red': !pump.available,
                                            }"
                                            style="border: 1px solid lightgray"
                                            >{{ pumpTypeToSymbol[pump.fuel_type] }}</span
                                        >
                                        <input
                                            @keydown.space.stop
                                            type="number"
                                            style="width: 50px; line-height: 2"
                                            class="ma-1"
                                            size="10"
                                            v-model="pump.price"
                                        />
                                    </div>
                                </div>
                                <v-btn
                                    @click.stop="updateFuelStationPrices(station.id, station.pumps); editedStationId = ''; panToStationCoordinates(station)"
                                    color="blue"
                                    class="my-1 ml-1"
                                    size="x-small"
                                    >save</v-btn
                                >
                            </div>
                        </v-list-item-subtitle>
                    </div>
                    <v-btn
                        v-if="editedStationId != station.id"
                        @click.stop="editedStationId = station.id"
                        color=""
                        class="my-1"
                        size="small"
                        variant="outlined"
                        >edit</v-btn
                    >
                    <template v-if="editedStationId == station.id">
                        <v-btn
                            @click.stop="editedStationId = ''"
                            color=""
                            class="my-1"
                            size="small"
                            variant="outlined"
                            >cancel</v-btn
                        >
                        <v-btn
                            @click.stop="handleDeleteFuelStation(station.id)"
                            color="red"
                            class="my-1 ml-1"
                            size="x-small"
                            variant="outlined"
                            >delete</v-btn
                        >
                    </template>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-app-bar-title>Fuel Stations Map</v-app-bar-title>
        </v-app-bar>

        <v-main>
            <div ref="mapDiv" class="h-100 w-100"></div>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { useGeoLocation } from "../geolocation";
import {
    getFuelStations,
    createFuelStation,
    updateStationName,
    updateFuelStationPrices,
    deleteFuelStation,
    FuelStationDTO,
    Pump,
} from "../services/fuelStationService";
import { Ref, computed, onMounted, ref } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

let markerLib: google.maps.MarkerLibrary;

const fuelStations: Ref<FuelStationDTO[]> = ref([]);

const createPanel = ref("");
const editedStationId = ref("");

const blankFormData = {
    id: "",
    name: "",
    address: "",
    city: "",
    latitude: 0,
    longitude: 0,
    pumps: [
        {
            id: 10001,
            fuel_type: "BENZIN_95",
            price: 0,
            available: true,
        },
        {
            id: 10002,
            fuel_type: "BENZIN_98",
            price: 0,
            available: true,
        },
        {
            id: 10003,
            fuel_type: "DIESEL",
            price: 0,
            available: true,
        },
    ],
};

const form = ref({ ...blankFormData });

const { coordinates } = useGeoLocation();

const drawer = ref(true);

const currentPosition = computed(() => ({
    lat: coordinates.value?.latitude,
    lng: coordinates.value?.longitude,
}));

const mapDiv = ref(null);
let map: any = null;
let markers: google.maps.Marker[] = [];

let infoWindow: any = null;

onMounted(async () => {
    const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
    });

    await loader.importLibrary("maps");
    markerLib = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

    getFuelStations().then(async (data) => {
        fuelStations.value = data;

        map = new google.maps.Map(mapDiv.value as any, {
            center: { lat: currentPosition.value.lat, lng: currentPosition.value.lng },
            zoom: 13,
            disableDefaultUI: true,
            mapId: "fuelStations",
        });

        infoWindow = new google.maps.InfoWindow();

        fuelStations.value.forEach((station: any) => {
            const marker = new markerLib.Marker({
                map: map,
                position: {
                    lat: station.latitude,
                    lng: station.longitude,
                },
                title: station.id,
            });

            marker.addListener("click", () => {
                infoWindow.close();
                const station = fuelStations.value.find((s: any) => s.id === marker.getTitle());
                infoWindow.setContent(getStationInfoWindowHTML(station));
                infoWindow.open(marker.getMap(), marker);
            });

            markers.push(marker);
        });
    });
});

function panToStationCoordinates(station: any) {
    const marker = markers.find((m) => m.getTitle() === station.id);
    map.panTo(marker!.getPosition());
    infoWindow.close();
    infoWindow.setContent(getStationInfoWindowHTML(station));
    infoWindow.open(marker!.getMap(), marker);
}

async function submitCreateFuelStationForm() {
    const station = await createFuelStation(form.value);

    if (station) {
        const marker = new markerLib.Marker({
            map: map,
            position: {
                lat: station.latitude,
                lng: station.longitude,
            },
            title: station.id,
        });

        marker.addListener("click", () => {
            infoWindow.close();
            const station = fuelStations.value.find((s: any) => s.id === marker.getTitle());
            infoWindow.setContent(getPumpHTML(station!.pumps));
            infoWindow.open(marker.getMap(), marker);
            map.panTo(marker.getPosition());
        });

        markers.push(marker);

        fuelStations.value.push(station);
        form.value = { ...blankFormData };

        createPanel.value = "";
    }
}

const pumpTypeToSymbol: { [key: string]: string } = {
    BENZIN_95: "95",
    BENZIN_98: "98",
    DIESEL: "D",
};

function getPumpHTML(pumps: Pump[]) {
    const pumpHTML = pumps.map((pump: Pump) => {
        return `<div class="d-flex flex-column justify-space-evenly">
                    <span class="pa-1 ${
                        pump.available ? "bg-green" : "bg-red"
                    } text-center" style="border: 1px solid lightgray">${
            pumpTypeToSymbol[pump.fuel_type]
        }</span>
                    <span class="font-weight-bold pa-1 text-center">${pump.price}</span>
                </div>`;
    });

    return `<div class="d-flex">${pumpHTML.join("")}</div>`;
}

function getStationInfoWindowHTML(station: any) {
    return `<div class="d-flex flex-column">
                <span class="font-weight-bold">${station.name}</span>
                <span>${station.address}</span>
                <span>${station.city}</span>
                ${getPumpHTML(station.pumps)}
            </div>`;
}

function handleDeleteFuelStation(stationId: string) {
    deleteFuelStation(stationId).then(() => {
        const marker = markers.find((m) => m.getTitle() === stationId);
        marker!.setMap(null);
        markers = markers.filter((m) => m.getTitle() !== stationId);

        fuelStations.value = fuelStations.value.filter((s) => s.id !== stationId);
    });
}
</script>

<style>
.v-expansion-panel-text__wrapper {
    padding: 0 !important;
}

.v-input__details {
    padding: 0 !important;
    min-height: 0 !important;
}
</style>
