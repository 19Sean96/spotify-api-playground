import axios from "axios";

async function getAudioAnalysis(id,token) {
    try {
        let res = await axios({
            url: `https://api.spotify.com/v1/audio-analysis/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            json: true
        })

        if (res.status) console.log('GET ANALYSIS STATUS: ', res.status)
        console.log("THIS IS THE AUDIO ANALYSIS", res.data);

        return res.data
    }

    catch (err) {
        console.error(err)
    }
}

async function getAudioFeatures(id,token) {
    try {
        let res = await axios({
            url: `https://api.spotify.com/v1/audio-features/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            json: true
        })

        if (res.status) console.log('GET FEATURES STATUS: ', res.status)
        console.log("THIS IS THE AUDIO FEATURES", res.data);

        return res.data
    }

    catch (err) {
        console.error(err)
    }
}
async function getProfile(token) {
    try {
        let res = await axios({
            url: "https://api.spotify.com/v1/me",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            json: true,
        })

        if (res.status) console.log('GET PROFILE STATUS: ', res.status)

        return res.data
    }
    catch (err) {
        console.error(err)
    }
}

const roundTo = (n, d=2) => +n.toFixed(d)
const randsgn = () => Math.pow(-1, Math.round(Math.random))
const rand = (max = 1, min = 0, d = 2) => roundTo(min + (max - min) * Math.random(), d)

export {getAudioAnalysis, getAudioFeatures, getProfile, roundTo, randsgn, rand}