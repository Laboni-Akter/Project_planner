<template>
    <tr>
      <td v-for="(header, index) in headers" :key="index">
        <slot :item="item" :name="columnName(header)">
          <div>
            {{ getNonSlotValue(item, header) }}
          </div>
        </slot>
      </td>
    </tr>
  </template>
  
  <script>
  export default {
    name: "DataTableRowHandler",
    components: {},
    props: {
      itemClass: {
        type: String,
        default: "",
      },
      item: {
        type: Object,
        default: () => {
          return {};
        },
      },
      headers: {
        type: Array,
        default: () => {
          return [];
        },
      },
    },
    data() {
      return {};
    },
    methods: {
      columnName(header) {
        return `item.${header.value}`;
      },
      getNonSlotValue(item, header) {
        const val = item[header.value];
  
        if (val) {
          return val;
        }
  
        return "";
      },
    },
  };
  </script>