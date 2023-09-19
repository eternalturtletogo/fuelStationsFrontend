import { onUnmounted, onMounted, ref } from "vue";

export function useGeoLocation() {
    const coordinates = ref({ latitude: 0, longitude: 0 });
    const isSupported = 'navigator' in window && 'geolocation' in navigator;

    let watcher: any = null;

    onMounted(() => {
        if (isSupported) {
            watcher = navigator.geolocation.watchPosition(position => (coordinates.value = position.coords));
        }
    });

    onUnmounted(() => {
        if (watcher) navigator.geolocation.clearWatch(watcher);
    });

    return { coordinates };
}