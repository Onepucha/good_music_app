<script lang="ts" setup>
const props = defineProps<{
  codeQuantity: Array<string>
}>()

const emit = defineEmits(['change', 'complete'])

let code: string[] = props.codeQuantity || Array(6)
let dataFromPaste: string[] | undefined
const keysAllowed: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const isNumber = (event: Event) => {
  ;(event.currentTarget as HTMLInputElement).value = ''
  const keyPressed: string = (event as KeyboardEvent).key
  if (!keysAllowed.includes(keyPressed)) {
    event.preventDefault()
  }
}

const handleInput = (event: Event) => {
  const inputType = (event as InputEvent).inputType
  let currentActiveElement = event.target as HTMLInputElement

  if (inputType === 'insertText')
    (currentActiveElement.nextElementSibling as HTMLElement)?.focus()

  if (inputType === 'insertFromPaste' && dataFromPaste) {
    for (const num of dataFromPaste) {
      let id: number = parseInt(currentActiveElement.id.split('_')[1])
      currentActiveElement.value = num
      code[id] = num
      if (currentActiveElement.nextElementSibling) {
        currentActiveElement =
          currentActiveElement.nextElementSibling as HTMLInputElement
        ;(currentActiveElement.nextElementSibling as HTMLElement)?.focus()
      }
    }
  }

  let value: string = code.join('')

  emit('change', value)

  if (value.length >= props.codeQuantity.length) {
    emit('complete', value)
  }
}

const handleDelete = (event: Event) => {
  let value = (event.target as HTMLInputElement).value
  let currentActiveElement = event.target as HTMLInputElement
  if (!value)
    (currentActiveElement.previousElementSibling as HTMLElement)?.focus()
}

const onPaste = (event: Event) => {
  dataFromPaste = (event as ClipboardEvent).clipboardData
    ?.getData('text')
    .trim()
    .split('')

  if (dataFromPaste) {
    for (const num of dataFromPaste) {
      if (!keysAllowed.includes(num)) event.preventDefault()
    }
  }
}
</script>

<template>
  <div class="g-input-verification-code">
    <div class="g-input-verification-code__wrap">
      <input
        v-for="(n, index) in code"
        :id="'input_' + index"
        :key="index"
        v-model="code[index]"
        maxlength="1"
        pattern="\d*"
        type="number"
        @input="handleInput"
        @keypress="isNumber"
        @paste="onPaste"
        @keydown.delete="handleDelete"
      />
    </div>
  </div>
</template>

<style scoped></style>
