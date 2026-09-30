// Banco incorporado a las evaluaciones originales.
var encefaloEvaluations = [
  {
    "id": "33da7371-8264-5a6c-a6b0-b81a63e38793",
    "title": "Organización y meninges",
    "code": "ENCEFALO1",
    "questionIds": [
      "d9433d0c-5f19-5cd3-aa54-bced1909a690",
      "cd70611a-4b2c-53c2-a0ed-6e77792705a1",
      "b293f229-c3ae-50fa-af0f-b572ce3e2376",
      "7b80b008-f068-5b7b-a574-01385492448e",
      "aa00ada0-ff00-5559-aff1-6fca8ce90569",
      "f9677388-622a-573f-acc2-b898d79510ed",
      "6e74bcad-a602-5150-a6c7-9e7dafa0e23c",
      "5224ba16-6bda-52da-a177-e2c2223ce7e0",
      "24e55e1a-44ee-5b7f-a13b-9d8c1ce04f58",
      "f8412c0f-0fa0-5a37-ae5c-09b6c1e5f757"
    ]
  },
  {
    "id": "2273cb7e-f0d5-594d-a3df-e1f5e9ba7ec2",
    "title": "Ventrículos, LCR y barreras",
    "code": "ENCEFALO2",
    "questionIds": [
      "14d14f51-8785-53bb-a3c0-a4e4513d2570",
      "48efdc83-79ac-5e40-aba5-0810360b047c",
      "6198dee5-3795-52d4-abed-f76cd8d5917d",
      "aa326b5e-7bc3-5676-aa01-4842b7afae37",
      "b817fc21-c2aa-5223-a7d4-d4bfe0f2f51d",
      "d4e58017-fe62-5b78-a15e-d67887e7f27f",
      "f3df4df3-ccda-5d00-ad74-5fc39c2273ee",
      "d8d7e798-7a13-5e2c-a775-79fd721cab23",
      "af6b2e55-7c60-569e-acc9-177940fdadfa",
      "5c7419e8-5838-519a-af69-b8640e15238f"
    ]
  }
];
Object.assign(nervousQuestionImages, {
  "d9433d0c-5f19-5cd3-aa54-bced1909a690": {
    "src": "/juegos/assets/encefalo/s3-4.jpeg",
    "alt": "Regiones principales del encéfalo",
    "credit": "Imagen de la presentación · diap. 3"
  },
  "cd70611a-4b2c-53c2-a0ed-6e77792705a1": {
    "src": "/juegos/assets/encefalo/s3-4.jpeg",
    "alt": "Regiones principales del encéfalo",
    "credit": "Imagen de la presentación · diap. 3"
  },
  "b293f229-c3ae-50fa-af0f-b572ce3e2376": {
    "src": "/juegos/assets/encefalo/s3-4.jpeg",
    "alt": "Regiones principales del encéfalo",
    "credit": "Imagen de la presentación · diap. 3"
  },
  "7b80b008-f068-5b7b-a574-01385492448e": {
    "src": "/juegos/assets/encefalo/s3-4.jpeg",
    "alt": "Regiones principales del encéfalo",
    "credit": "Imagen de la presentación · diap. 3"
  },
  "aa00ada0-ff00-5559-aff1-6fca8ce90569": {
    "src": "/juegos/assets/encefalo/s7-2.png",
    "alt": "Formación del tubo neural",
    "credit": "Imagen de la presentación · diap. 7"
  },
  "f9677388-622a-573f-acc2-b898d79510ed": {
    "src": "/juegos/assets/encefalo/s9-4.png",
    "alt": "Vesículas encefálicas embrionarias",
    "credit": "Imagen de la presentación · diap. 9"
  },
  "6e74bcad-a602-5150-a6c7-9e7dafa0e23c": {
    "src": "/juegos/assets/encefalo/s12-4.png",
    "alt": "Capas meníngeas y superficies del encéfalo",
    "credit": "Imagen de la presentación · diap. 12"
  },
  "5224ba16-6bda-52da-a177-e2c2223ce7e0": {
    "src": "/juegos/assets/encefalo/s12-4.png",
    "alt": "Capas meníngeas y superficies del encéfalo",
    "credit": "Imagen de la presentación · diap. 12"
  },
  "24e55e1a-44ee-5b7f-a13b-9d8c1ce04f58": {
    "src": "/juegos/assets/encefalo/s12-4.png",
    "alt": "Capas meníngeas y superficies del encéfalo",
    "credit": "Imagen de la presentación · diap. 12"
  },
  "f8412c0f-0fa0-5a37-ae5c-09b6c1e5f757": {
    "src": "/juegos/assets/encefalo/s12-4.png",
    "alt": "Capas meníngeas y superficies del encéfalo",
    "credit": "Imagen de la presentación · diap. 12"
  },
  "14d14f51-8785-53bb-a3c0-a4e4513d2570": {
    "src": "/juegos/assets/encefalo/s15-2.png",
    "alt": "Sistema ventricular del encéfalo",
    "credit": "Imagen de la presentación · diap. 15"
  },
  "48efdc83-79ac-5e40-aba5-0810360b047c": {
    "src": "/juegos/assets/encefalo/s15-2.png",
    "alt": "Sistema ventricular del encéfalo",
    "credit": "Imagen de la presentación · diap. 15"
  },
  "6198dee5-3795-52d4-abed-f76cd8d5917d": {
    "src": "/juegos/assets/encefalo/s15-2.png",
    "alt": "Sistema ventricular del encéfalo",
    "credit": "Imagen de la presentación · diap. 15"
  },
  "aa326b5e-7bc3-5676-aa01-4842b7afae37": {
    "src": "/juegos/assets/encefalo/s18-2.png",
    "alt": "Circulación del líquido cefalorraquídeo",
    "credit": "Imagen de la presentación · diap. 18"
  },
  "b817fc21-c2aa-5223-a7d4-d4bfe0f2f51d": {
    "src": "/juegos/assets/encefalo/s18-2.png",
    "alt": "Circulación del líquido cefalorraquídeo",
    "credit": "Imagen de la presentación · diap. 18"
  },
  "d4e58017-fe62-5b78-a15e-d67887e7f27f": {
    "src": "/juegos/assets/encefalo/s18-2.png",
    "alt": "Circulación del líquido cefalorraquídeo",
    "credit": "Imagen de la presentación · diap. 18"
  },
  "f3df4df3-ccda-5d00-ad74-5fc39c2273ee": {
    "src": "/juegos/assets/encefalo/s25-1.png",
    "alt": "Organización de los capilares",
    "credit": "Imagen de la presentación · diap. 25"
  },
  "d8d7e798-7a13-5e2c-a775-79fd721cab23": {
    "src": "/juegos/assets/encefalo/s24-4.png",
    "alt": "Barrera entre sangre y tejido nervioso",
    "credit": "Imagen de la presentación · diap. 24"
  },
  "af6b2e55-7c60-569e-acc9-177940fdadfa": {
    "src": "/juegos/assets/encefalo/s24-4.png",
    "alt": "Barrera entre sangre y tejido nervioso",
    "credit": "Imagen de la presentación · diap. 24"
  },
  "5c7419e8-5838-519a-af69-b8640e15238f": {
    "src": "/juegos/assets/encefalo/s25-1.png",
    "alt": "Organización de los capilares",
    "credit": "Imagen de la presentación · diap. 25"
  }
});
