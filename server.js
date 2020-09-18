require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const animal = process.env.ANIMAL
console.log(animal);