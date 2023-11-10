/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
//import { VuetifyDateAdapter } from "vuetify/labs/date/adapters/vuetify";
/*


import {
  VDataTable,
  VDataTableServer,
  VDataTableVirtual,
} from "vuetify/labs/VDataTable";

import { VDataIterator } from "vuetify/labs/VDataIterator";

 */
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  // date: { adapter: VuetifyDateAdapter },
  /*
  components: {
    VDataIterator,
    VDataTable,
    VDataTableServer,
    VDataTableVirtual,
  },

   */
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
        },
      },
    },
  },
});
