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

export {getAudioAnalysis, getAudioFeatures, getProfile}