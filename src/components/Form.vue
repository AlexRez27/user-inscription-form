<template>
  <form action="#" class="form" @submit.prevent="submitHendler">
    <div class="form__cont">
      <div class="form__block">
          <input v-model.trim="firstName"
                 :class="{invalid: $v.firstName.$dirty && !$v.firstName.required} "
                 name="firstName" type="text" class="form__input"
                 placeholder="First Name">
          <small
              class="invalid--helper"
              :class="{active: $v.firstName.$dirty && !$v.firstName.required}"
              >First name field musn't be empty
          </small>
          <input type="text" v-model.trim="country" list="counties"
                  :class="{invalid: $v.country.$dirty && !$v.country.required} "
                  name="country" id="country" class="form__input"
                  @change="getRegions"
                  placeholder="Country">
            <datalist id="counties">
              <option v-for="(country,i) in countries"
                     :key="i"
                     :value="country"> {{ country }}
              </option>
            </datalist>
          <small
              class="invalid--helper"
              :class="{active: $v.country.$dirty && !$v.country.required}"
              >Choose your country
          </small>
          <input v-model.trim="city" type="text"
                  :class="{invalid: $v.city.$dirty && !$v.city.required && cities.length}"
                  name="city" id="city" class="form__input"
                  list="cities" placeholder="City"
                  >
           <datalist v-if="cities.length" id="cities">
              <option v-for="(city,i) in cities"
                     :key="i"
                     :value="city"> {{ city }}
              </option>
            </datalist>
          <small
              class="invalid--helper"
              :class="{active: $v.city.$dirty && !$v.city.required && cities.length}"
              >Choose your city
          </small>
          <input v-model.trim="email"
                 :class="{invalid: $v.email.$dirty && !$v.email.required}"
                 name="email" id="email" type="email" class="form__input"
                 placeholder="Email" novalidate
                 >
          <small

              class="invalid--helper"
              :class="{active: $v.email.$dirty && !$v.email.required}"
              >Enter your email
          </small>
          <small
              class="invalid--helper"
              :class="{active: $v.email.$dirty && !$v.email.email}"
              >Entered value is not email. Correct it
          </small>
        </div>
        <div class="form__block">
          <input v-model.trim="lastName"
                 :class="{invalid: $v.lastName.$dirty && !$v.lastName.required}"
                 name="lastName" id="lastName" type="text" class="form__input"
                 placeholder="Last Name">
          <small
              class="invalid--helper"
              :class="{active: $v.lastName.$dirty && !$v.lastName.required}"
              >Last name field musn't be empty
          </small>
          <input v-model.trim="region" list="regions" type="text"
                  :class="{invalid: $v.region.$dirty && !$v.region.required}"
                  name="region" id="region" class="form__input"
                  @change="getCities" placeholder="Region">
            <datalist v-if="regions.length" id="regions">
              <option v-for="(region,i) in regions"
                     :key="i"
                     :value="region"> {{ region }}
              </option>
            </datalist>
          <small
              class="invalid--helper"
              :class="{active: $v.region.$dirty && !$v.region.required}"
              >Choose your region
          </small>
          <input v-model.trim="age"
                 name="age" id="age" type="number"
                 class="form__input" placeholder="Age">
          <small
              v-if="$v.age.$dirty && !$v.age.required"
              class="invalid--helper"
              :class="{active: $v.age.$dirty && !$v.age.required}"
              >Enter your Age
          </small>
          <small
              class="invalid--helper"
              :class="{active: $v.age.$dirty && !$v.age.minValue}"
              >Age must be more then 0
          </small>
          <div class="form__password">
            <input v-model.trim="password"
                   :class="{active: $v.password.$dirty && !$v.password.required}"
                   name="password" id="password" :type="isPassword ? 'password' : 'text'" class="form__input"
                   placeholder="Password">
            <i @click="isPassword = !isPassword" class="far fa-eye"></i>
          </div>
          <small
              class="invalid--helper"
              v-if="$v.password.$dirty && !$v.password.required"
              :class="{active: $v.password.$dirty && !$v.password.required}"
              >Enter the password
          </small>
          <small
              v-if="$v.password.$dirty && !$v.password.minLength"
              class="invalid--helper"
              :class="{active: $v.password.$dirty && !$v.password.minLength}"
              >The minimal length of password is {{ $v.password.$params.minLength.min }}. Your length is {{ password.length }}.
          </small>
          <small
              class="invalid--helper"
              :class="{active: $v.password.$dirty && !$v.password.valid}"
              >Password must have at least one upper letter, one lower letter, one number and one special symbol
          </small>
        </div>
    </div>
    <button class="form__button" type="submit">Submit</button>
  </form>
</template>

<script>
import { email, required, minLength, minValue } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Form',
  data () {
    return {
      firstName: '',
      lastName: '',
      country: '',
      city: '',
      birthDay: '',
      age: '',
      email: '',
      password: '',
      region: '',
      countries: [],
      regions: [],
      cities: [],
      isPassword: true
    }
  },
  computed: {
    ...mapGetters(['dataList']),
    birthday () {
      return this.date ? new Date(this.birthDay) : null
    }
  },
  validations: {
    firstName: { required },
    lastName: { required },
    country: { required },
    region: { required },
    city: { required },
    age: { required, minValue: minValue(0) },
    email: { email, required },
    password: {
      required,
      minLength: minLength(8),
      valid: function (value) {
        const containsUppercase = /[A-Z]/.test(value)
        const containsLowercase = /[a-z]/.test(value)
        const containsNumber = /[0-9]/.test(value)
        const containsSpecial = /[#?!@$%^&*-]/.test(value)
        return containsUppercase && containsLowercase && containsNumber && containsSpecial
      }
    }
  },
  methods: {
    ...mapActions(['getData']),
    submitHendler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
      }
    },
    async getRegions () {
      if (this.country && this.countries.includes(this.country)) {
        await this.getData({ entity: 'states', name: this.country })
        this.regions = this.dataList.map(region => region.state_name)
      } else {
        this.region = ''
        this.city = ''
        this.country = ''
      }
    },
    async getCities () {
      if (this.region && this.regions.includes(this.region)) {
        await this.getData({ entity: 'cities', name: this.region })
        this.cities = this.dataList.map(citi => citi.city_name)
      } else {
        this.city = ''
        this.region = ''
      }
    }
  },
  async mounted () {
    await this.getData({ entity: 'countries' })
    this.countries = this.dataList.map(country => country.country_name)
  }
}
</script>

<style lang="scss">
 .form{
  font-family: 'Open Sans Condensed', arial, sans;
  width: 700px;
  padding: 30px;
  background: #FFFFFF;
  margin: 50px auto;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.22);
  &__cont{
    display: flex;
  }
    @media screen and (max-width: 768px) {
      .form__cont{
        flex-direction: column;
      }
    }
  &__block{
    width: 50%;
    &:first-child{
      margin-right: 15px;
    }
    &:last-child{
      margin-left: 15px;
    }
  }
  &__password{
    display: flex;
    align-items: center;
    position: relative;
  }
  &__input{
    box-sizing: border-box;
    outline: none;
    display: block;
    width: 100%;
    padding: 7px;
    border: none;
    border-bottom: 1px solid #ddd;
    background: transparent;
    font: 16px Arial, Helvetica, sans-serif;
    height: 45px;
  }
  &__button{
    box-shadow: inset 0px 1px 0px 0px #45D6D6;
    background-color: #2CBBBB;
    border: 1px solid #27A0A0;
    display: inline-block;
    cursor: pointer;
    color: #FFFFFF;
    font-family: 'Open Sans Condensed', sans-serif;
    font-size: 14px;
    padding: 8px 18px;
    text-decoration: none;
    text-transform: uppercase;
    &:hover {
      background:linear-gradient(to bottom, #34CACA 5%, #30C9C9 100%);
      background-color:#34CACA;
    }
  }
}
i {
  position: absolute;
  right: 5px;
  cursor: pointer;
}
.invalid{
  border-bottom:1px solid red;
  &--helper{
    color: red;
    visibility: hidden;
  }
}
  .active{
    visibility: visible;
  }
  option {
    background-color: #fff;
  }

</style>
