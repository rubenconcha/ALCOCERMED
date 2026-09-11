// Imágenes originales de Servier Medical Art (CC BY-SA 3.0).
// Solo estas 25 preguntas: verdadero/falso no lleva imagen.
var nervousQuestionImages = {
  "a1a0219f-e9e2-5790-8121-26f9842336a6": {
    "src": "/juegos/assets/tejido-nervioso/sistema.png",
    "alt": "Vista general del sistema nervioso humano",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Nervous_system_1_--_Smart-Servier.png"
  },
  "51f2d419-e4c4-52e1-89cb-2b6bb08fdcbe": {
    "src": "/juegos/assets/tejido-nervioso/nervio.png",
    "alt": "Organización de un nervio periférico y sus fibras",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Nerve_--_Smart-Servier.png"
  },
  "a226f83f-9221-50b4-b7b8-57e12abdcf70": {
    "src": "/juegos/assets/tejido-nervioso/encefalo.png",
    "alt": "Vista lateral del encéfalo",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Brain_11_--_Smart-Servier.png"
  },
  "8c3561db-13ac-5611-8352-ded754baf35e": {
    "src": "/juegos/assets/tejido-nervioso/nervio.png",
    "alt": "Organización de un nervio periférico y sus fibras",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Nerve_--_Smart-Servier.png"
  },
  "e09871cc-9dde-5dc2-94e9-d24801feb294": {
    "src": "/juegos/assets/tejido-nervioso/autonomo.png",
    "alt": "Esquema de conexiones nerviosas entre el encéfalo y el cuerpo",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Sympathetic_nervous_system_--_Smart-Servier.png"
  },
  "a1a269bc-acea-5dd7-9bd4-1cf9c14358a8": {
    "src": "/juegos/assets/tejido-nervioso/union-muscular.png",
    "alt": "Conexión entre una terminación nerviosa y fibras musculares",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Neuromuscular_synapse_1_--_Smart-Servier.png"
  },
  "f5d2b4b9-7a4c-5eeb-a3fc-c0115b866da1": {
    "src": "/juegos/assets/tejido-nervioso/autonomo.png",
    "alt": "Esquema de conexiones nerviosas entre el encéfalo y el cuerpo",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Sympathetic_nervous_system_--_Smart-Servier.png"
  },
  "305abaec-68d4-58b5-8dec-e076ab9cb4f6": {
    "src": "/juegos/assets/tejido-nervioso/autonomo.png",
    "alt": "Esquema de conexiones nerviosas entre el encéfalo y el cuerpo",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Sympathetic_nervous_system_--_Smart-Servier.png"
  },
  "141b561d-7c20-509b-84a4-2aa6eaa1865e": {
    "src": "/juegos/assets/tejido-nervioso/neurona.png",
    "alt": "Morfología de una célula nerviosa",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Neuron_7_--_Smart-Servier.png"
  },
  "d7d990b1-b5ae-580c-9d34-253c1ddba754": {
    "src": "/juegos/assets/tejido-nervioso/medula.png",
    "alt": "Corte transversal de la médula espinal",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Spinal_cord_section_1_--_Smart-Servier.png"
  },
  "883c4ce0-9cc3-53d1-9885-80f4622d92c9": {
    "src": "/juegos/assets/tejido-nervioso/neurona-detalle.png",
    "alt": "Ilustración de una neurona con su cuerpo celular y prolongaciones",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Neuron_1_--_Smart-Servier.png"
  },
  "5f8d849a-6ed8-58be-a138-089f4206f1a9": {
    "src": "/juegos/assets/tejido-nervioso/neurona-detalle.png",
    "alt": "Ilustración de una neurona con su cuerpo celular y prolongaciones",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Neuron_1_--_Smart-Servier.png"
  },
  "d52034d3-c792-5746-b036-da0ce8f42f24": {
    "src": "/juegos/assets/tejido-nervioso/neurona-detalle.png",
    "alt": "Ilustración de una neurona con su cuerpo celular y prolongaciones",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Neuron_1_--_Smart-Servier.png"
  },
  "98094832-be1c-5ca1-ad91-8b4e15305e4f": {
    "src": "/juegos/assets/tejido-nervioso/nervio.png",
    "alt": "Organización de un nervio periférico y sus fibras",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Nerve_--_Smart-Servier.png"
  },
  "2da929a4-cd79-50e3-81a5-d23145e09f5d": {
    "src": "/juegos/assets/tejido-nervioso/sinapsis.png",
    "alt": "Detalle de una conexión entre dos células nerviosas",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Synapse_2_--_Smart-Servier.png"
  },
  "7b8b9f64-c847-57dc-9a9a-1bc60e5c77c3": {
    "src": "/juegos/assets/tejido-nervioso/neurona-detalle.png",
    "alt": "Ilustración de una neurona con su cuerpo celular y prolongaciones",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Neuron_1_--_Smart-Servier.png"
  },
  "55f203d6-c8ee-5a77-ab9c-557d20f7e19b": {
    "src": "/juegos/assets/tejido-nervioso/neurona-detalle.png",
    "alt": "Ilustración de una neurona con su cuerpo celular y prolongaciones",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Neuron_1_--_Smart-Servier.png"
  },
  "3178ada6-7dde-51a8-b0f9-222d88511752": {
    "src": "/juegos/assets/tejido-nervioso/neurona-detalle.png",
    "alt": "Ilustración de una neurona con su cuerpo celular y prolongaciones",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Neuron_1_--_Smart-Servier.png"
  },
  "3a370012-42e8-5e2e-abd7-f592d756ad7b": {
    "src": "/juegos/assets/tejido-nervioso/glia.png",
    "alt": "Ilustración de una célula de la neuroglía",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_CNS_cell_lines_-_Oligodendrocyte_1_--_Smart-Servier.png"
  },
  "2377928d-7bb4-5142-b220-2754ce649a7f": {
    "src": "/juegos/assets/tejido-nervioso/epitelio.png",
    "alt": "Ilustración de una célula con prolongaciones apicales",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Ependymal_cell_1_--_Smart-Servier.png"
  },
  "8d91c29f-ccf4-5b67-8d98-324853f3b388": {
    "src": "/juegos/assets/tejido-nervioso/defensa.png",
    "alt": "Morfología de una célula de la neuroglía",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Microglia_1_--_Smart-Servier.png"
  },
  "fab3b330-bd9c-5151-9fdb-88b6f5e50536": {
    "src": "/juegos/assets/tejido-nervioso/soporte.png",
    "alt": "Morfología de una célula con múltiples prolongaciones",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Astrocyte_1_--_Smart-Servier.png"
  },
  "9560acb7-11d6-5210-814b-9bc360c033f4": {
    "src": "/juegos/assets/tejido-nervioso/nervio.png",
    "alt": "Organización de un nervio periférico y sus fibras",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Nerve_--_Smart-Servier.png"
  },
  "9d794ddd-3368-5c9c-9471-ffd76ab96dc2": {
    "src": "/juegos/assets/tejido-nervioso/nervio.png",
    "alt": "Organización de un nervio periférico y sus fibras",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Nerve_--_Smart-Servier.png"
  },
  "d3b3e182-6629-53a8-9348-17ee12436cc5": {
    "src": "/juegos/assets/tejido-nervioso/nervio.png",
    "alt": "Organización de un nervio periférico y sus fibras",
    "source": "https://commons.wikimedia.org/wiki/File:Nervous_system_-_Nerve_--_Smart-Servier.png"
  }
};
