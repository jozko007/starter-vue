<template>
  <div>
    <p class="decode-result">QR Code: <b>{{ result }}</b></p>
    <p class="decode-result">Name: <b>{{ name }}</b></p>
    <p class="decode-result">Email: <b>{{ email }}</b></p>
    <p class="decode-result">Scanned at: <b>{{ scannedAt }}</b></p>

    <QrcodeStream :camera="camera" @decode="onDecode" @init="onInit">
      <div v-show="cameraForzen" class="validation-layer">
        <div class="validation-notice" v-if="validating">
          Long validation in progress...
        </div>

        <div class="validation-result" v-if="!validating">
          <div v-if="isValid === 2" class="valid">
            Valid ticket
          </div>

          <div v-else-if="isValid === 1" class="already__scanned">
            Already scanned
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
import {firestore} from "./firebase";
/* eslint-disable */
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  components: {
    QrcodeStream
  },
  data() {
    return {
      isValid: 0,
      validating: false,
      camera: 'auto',
      result: null,

      loading: false,
      firstLoad: true,

      name: '',
      email: '',
      scannedAt: ''
    }
  },

  computed: {
    cameraForzen() {
      return this.camera === 'off' || (this.loading && !this.firstLoad)
    }
  },

  methods: {
    async onDecode(content) {
      this.result = content

      this.stopCamera()

      this.validating = true
      this.isValid = await this.validate(content)
      this.validating = false


      window.setTimeout(() => {
        this.startCamera()
      }, 2000)
    },

    stopCamera() {
      this.camera = 'off'
    },

    startCamera() {
      // use default settings
      this.camera = 'auto'
    },

    validate(content) {
      this.name = '';
      this.email = '';
      this.scannedAt = '';

      return firestore
          .collection("qr")
          .where("ticketId", "==", content)
          .get()
          .then(snapshot => {
            return new Promise(resolve => {
              if (!snapshot.empty) {
                if(snapshot.size !== 1) {
                  return resolve(0)
                }
                const doc = snapshot.docs[0];

                this.name = doc.data().name;
                this.email = doc.data().email;

                if (doc.data().scannedAt) {
                  this.scannedAt = doc.data().scannedAt.toDate();
                  return resolve(1)
                }

                firestore.collection("qr").doc(doc.id).update({scannedAt: new Date()});

                return resolve(2)
              } else {
                return resolve(0)
              }
            });
          });
    },

    async onInit(promise) {
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

.already__scanned {
  color: orange;
}
</style>
