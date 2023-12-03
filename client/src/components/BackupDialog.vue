<script setup>
import { computed } from "vue";

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  process: {
    type: Object,
    default: () => ({}),
  },
  drive: {
    type: Object,
    default: () => ({ name: "", mountpoint: "" }),
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "start", "cancel", "close"]);
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const title = computed(() => {
  let msg = `Run backup on drive ${props.drive.label}  "${props.drive.name}" ?`;
  if (props.process.status !== null && props.active === false) {
    msg = `Backup run completed`;
  }
  return msg;
});
const start = () => {
  emit("start");
};
const cancel = () => {
  if (props.active === true) {
    emit("cancel");
  } else {
    emit("close");
  }
  value.value = false;
};
</script>

<template>
  <v-dialog :persistent="true" width="auto" v-model="value">
    <v-card rounded="lg" width="auto">
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="flat" @click="start">Start</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="warning" variant="flat" @click="cancel"
          >{{ props.active ? "cancel" : "close" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
