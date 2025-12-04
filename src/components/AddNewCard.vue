<template>
  <div class="addcard-wrapper">
    <div class="addcard-box">

      <div class="addcard-content">
        <h3 class="addcard-title">
          Tilføj nye varer til <br /> dit køleskab
        </h3>

        <router-link to="/indtast" class="addcard-btn">
          <i class="bi bi-plus-circle"></i>
          Tilføj varer
        </router-link>
      </div>

      <img v-bind:src="bagImg" alt="Indkøbspose" class="addcard-image" />

    </div>
  </div>
</template>


<script>

import bagImg from '@/assets/groceriebag.png';

export default {

  name: 'AddNewCard',

  data() {
    return { 
      bagImg,
      };
  },
  
}

</script>

<style scoped>

/* WRAPPER – styrer ydre spacing så kortet flugter med resten */
.addcard-wrapper {
  margin: 3rem 1.5rem 0 1.5rem; /* samme spacing som andre sektioner */
}

/* KORT-BOKS */
.addcard-box {
  position: relative;
  background: linear-gradient(135deg, #1f3121 0%, #446847 100%);
  color: white;
  border-radius: 24px;
  padding: 32px 24px;
  min-height: 170px;
  overflow: hidden;
  box-shadow: 0 12px 20px rgba(0,0,0,0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;

  animation: fadeInAddcard 0.45s ease;
}



/* TEKST-INDHOLD */
.addcard-content {
  z-index: 2;
  max-width: 60%;
}

.addcard-title {
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  margin-bottom: 16px;
}

/* CALL-TO-ACTION KNAP */
.addcard-btn {
  background: #F27405;
  color: #ffffff;
  font-weight: 600;
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 14px rgba(0,0,0,0.14);
  transition: 0.2s ease;
}

.addcard-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(242,116,5,0.25);
  filter: brightness(1.05);
}

/* BILLEDET */
.addcard-image {
  width: 120px;
  position: absolute;
  bottom: 30px;
  right: 14px;
  z-index: 1;
  filter: drop-shadow(0 12px 18px rgba(0,0,0,0.25));
}

/* ========================== */
/* TABLET (600px → 991px)     */
/* ========================== */
@media (min-width: 600px) and (max-width: 991px) {

  .addcard-wrapper {
    margin-left: 3rem;
    margin-right: 3rem;
    margin-top: 3rem;
  }

  .addcard-box {
    padding: 32px 28px;
    min-height: 180px;
  }

  .addcard-title {
    font-size: 22px;
    line-height: 28px;
  }

  .addcard-image {
    width: 150px;
    right: 20px;
  }
}


/* ========================== */
/* LAPTOP (992px → 1399px)    */
/* ========================== */
@media (min-width: 992px) {
  .addcard-wrapper {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }

  .addcard-box {
    padding: 48px 40px;
  }

  .addcard-image {
    width: 170px;
  }
}

/* ========================== */
/* DESKTOP (≥ 1400px)         */
/* ========================== */
@media (min-width: 1400px) {
  .addcard-wrapper {
    max-width: 85%;
    margin-top: 4rem;
  }

  .addcard-image {
    width: 180px;
    right: 24px;      
    bottom: 20px;  
  }
}

/* ========================== */
/* ULTRA-WIDE (≥ 1800px)      */
/* ========================== */
@media (min-width: 1800px) {
  .addcard-wrapper {
    max-width: 80%;
    margin-top: 5rem;
  }

  .addcard-image {
    width: 180px;
    right: 40px;
    bottom: 20px;
  }
}


/* ANIMATION ved indlæsning */

@keyframes fadeInAddcard {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}


</style>