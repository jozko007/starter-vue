<template>
  <div>
    <p class="decode-result">Last result: <b>{{ result }}</b></p>

    <QrcodeStream :camera="camera" @decode="onDecode" @init="onInit">
      <div v-show="cameraForzen" class="validation-layer">
        <div class="validation-notice" v-if="validating">
          Long validation in progress...
        </div>

        <div class="validation-result" v-if="!validating">
          <div v-if="isValid" class="valid">
            Valid ticket
          </div>

          <div v-else class="invalid">
            Not a valid ticket
          </div>
        </div>
      </div>
    </QrcodeStream>
  </div>
</template>

<script>
import { firestore } from "./firebase";
 /* eslint-disable */
 import { QrcodeStream } from 'vue-qrcode-reader';
export default {
  components: {
    QrcodeStream
  },
  data () {
    return {
      isValid: false,
      validating: false,
      camera: {},
      result: null,

      loading: false,
      firstLoad: true
    }
  },

  computed: {
    cameraForzen () {
      return this.camera === false || (this.loading && !this.firstLoad)
    }
  },

  methods: {
    async onDecode (content) {
      this.result = content

      this.stopCamera()

      this.validating = true
      this.isValid = await this.validate(content)
      this.validating = false
  

      window.setTimeout(() => {
        this.startCamera()
      }, 2000)
    },

    stopCamera () {
      this.camera = false
    },

    startCamera () {
      // use default settings
      this.camera = {}
    },

    validate (content) {
        return firestore
        .collection("qr")
        .where("ticketId", "==", content)
        .get()
        .then(snapshot => {
          return new Promise(resolve => {
                if (!snapshot.empty) {return resolve(true)}
                else{return resolve(false)}
          });
        });
    },

    async onInit (promise) {
      this.loading = true

      try {
        await promise
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
      } finally {
        this.firstLoad = false
        this.loading = false
      }
    }

  }
}
</script>

<style scoped>
.validation-layer {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, .8);
  text-align: center;
  padding: 10px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}

.validation-notice,
.validation-result {
  font-weight: bold;
  font-size: 1.4rem;
}

.valid {
  color: green;
}
.invalid {
  color: red;
}
</style>