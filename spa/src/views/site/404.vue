<template>
  <div class="pt-3 w-75 m-auto pb-5">
    <b-row>
      <b-col>
        <h1>{{ $t('generic.not-found-caption') }}</h1>
        <p>{{ $t('generic.not-found-message') }}</p>
        <img src="/images/opravit.jpg" :alt="$t('generic.we-must-fix')" width="800">
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue';

export default {
  name: 'not-found',
  components: {
    BRow,
    BCol,
  },
};
</script>
