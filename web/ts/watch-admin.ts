import axios from "axios";

function usePreset(cID: number, lectureHallID: number, presetID: number, streamID: number) {
    (document.getElementById("presetImage" + lectureHallID + "-" + presetID) as HTMLImageElement).classList.add("animate-pulse")
    axios.post("/api/course/" + cID + "/switchPreset/" + lectureHallID + "/" + presetID + "/" + (document.getElementById("streamID") as HTMLInputElement).value).then(r => {
        (document.getElementById("presetImage" + lectureHallID + "-" + presetID) as HTMLImageElement).classList.remove("animate-pulse")
    });
}