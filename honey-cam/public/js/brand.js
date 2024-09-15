import { readJson } from '../js/utils/json-manipulator.js';

const brandConfigs = await readJson('../config/brand.json');

const brandImagePath = brandConfigs.brandImagePath;  // Define this variable as needed
const brandImageWidth = brandConfigs.brandImageWidth; // Define this variable as needed

document.getElementById('brand_image').src = brandImagePath;
document.getElementById('brand_image').style.width = brandImageWidth;