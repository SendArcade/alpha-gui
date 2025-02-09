/* generated by pull.js */
const manifest = {
  "editorOnly": true,
  "noTranslations": true,
  "name": "Paint costume by default",
  "description": "Changes the default action of \"Choose a Sprite/Costume/Backdrop/Sound\" buttons, which open the library by default.",
  "credits": [
    {
      "name": "GarboMuffin"
    }
  ],
  "userscripts": [
    {
      "url": "userscript.js"
    }
  ],
  "settings": [
    {
      "dynamic": true,
      "id": "sprite",
      "name": "Add sprite",
      "type": "select",
      "potentialValues": [
        {
          "id": "library",
          "name": "Library"
        },
        {
          "id": "paint",
          "name": "Paint"
        },
        {
          "id": "surprise",
          "name": "Surprise"
        },
        {
          "id": "upload",
          "name": "Upload"
        }
      ],
      "default": "paint"
    },
    {
      "dynamic": true,
      "id": "costume",
      "name": "Add costume",
      "type": "select",
      "potentialValues": [
        {
          "id": "library",
          "name": "Library"
        },
        {
          "id": "paint",
          "name": "Paint"
        },
        {
          "id": "surprise",
          "name": "Surprise"
        },
        {
          "id": "upload",
          "name": "Upload"
        }
      ],
      "default": "paint"
    },
    {
      "dynamic": true,
      "id": "backdrop",
      "name": "Add backdrop",
      "type": "select",
      "potentialValues": [
        {
          "id": "library",
          "name": "Library"
        },
        {
          "id": "paint",
          "name": "Paint"
        },
        {
          "id": "surprise",
          "name": "Surprise"
        },
        {
          "id": "upload",
          "name": "Upload"
        }
      ],
      "default": "paint"
    },
    {
      "dynamic": true,
      "id": "sound",
      "name": "Add sound",
      "type": "select",
      "potentialValues": [
        {
          "id": "library",
          "name": "Library"
        },
        {
          "id": "record",
          "name": "Record"
        },
        {
          "id": "surprise",
          "name": "Surprise"
        },
        {
          "id": "upload",
          "name": "Upload"
        }
      ],
      "default": "library"
    }
  ],
  "dynamicDisable": true,
  "tags": [
    "recommended"
  ],
  "enabledByDefault": false
};
export default manifest;
