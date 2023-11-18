<script setup>
import { ref, computed, watch } from "vue";

const run = ref(false);
const props = defineProps({
  title: {
    type: String,
    default: "Do you really want to shut down?",
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "action", "cancel"]);

const status = computed(() => {
  return {
    title: props.title,
    value: value.value,
    run: run.value,
  };
});

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

watch(run, (value) => {
  if (value === true) emit("action", value);
});
watch(value, () => {
  run.value = false;
});

const cancel = () => {
  value.value = false;
  emit("cancel");
};
</script>

<template>
  <v-row justify="center">
    <v-dialog
      v-model="value"
      transition="dialog-top-transition"
      width="auto"
      theme="dark"
    >
      <v-card rounded="lg" class="fc_content">
        <v-card-title>{{ props.title }}</v-card-title>
        <v-card-text>
          <slot v-bind="status"></slot>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="tonal" @click="run = true">OK</v-btn>

          <v-btn color="error" variant="tonal" @click="cancel">Cancel</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped></style>
