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

async function setCurrentDevice(token, id) {
    console.log("setting device...");
    let res
    try {
        res = await axios({
            method: 'PUT',
            url: `https://api.spotify.com/v1/me/player`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                device_ids: [id],
                // play: false
            },
            json: true
        })

        if (res.status) console.log('GET DEVICES STATUS: ', res.status)
        console.log("THIS IS THE AVAILABLE DEVICES", res.data);

    }
    
    catch (err) {
        console.error(err)
        res = false
    }

    finally {
        return res?.data
    }
}

const roundTo = (n, d=2) => +n.toFixed(d)
const randsgn = () => Math.pow(-1, Math.round(Math.random))
const rand = (max = 1, min = 0, d = 2) => roundTo(min + (max - min) * Math.random(), d)

const shuffleArray = arr => arr
        .map(a => ({sort: Math.random(), value: a}))
        .sort((a,b) => a.sort - b.sort)
        .map(a => a.value)

export {getAudioAnalysis, getAudioFeatures, getProfile,setCurrentDevice, roundTo, randsgn, rand, shuffleArray}