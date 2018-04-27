<template>
  <b-container>
    <b-row>
      <b-col cols="5">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group id="groceriesType"
                        label="Groceries Type:"
                        label-for="groceriesInput">
            <b-form-select id="groceriesInput"
                          :options="foods"
                          required
                          v-model="form.groceries">
            </b-form-select>
          </b-form-group>
          <b-form-group id="fridgeType"
                        label="Fridge Type:"
                        label-for="fridgeInput">
            <b-form-select id="fridgeInput"
                          :options="fridges"
                          required
                          v-model="form.fridge">
            </b-form-select>
          </b-form-group>
          <b-form-group id="groceriesAmount"
                        label="Amounts:"
                        label-for="amountInput">
            <b-form-input id="amountInput"
                          type="number"
                          required
                          v-model="form.amount">
            </b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Add</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </b-col>
      <b-col cols="5">
        <p>Used Up</p>
        <b-list-group>
          <b-list-group-item v-for='(item, index) in used_list' :key='index'>{{item}}</b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <b-row>
      <b-table striped hover :items="items" :fields="fields">
        <template slot="actions" slot-scope="row">
          <b-button size="sm" @click.stop="decrease(row.item, row.index, $event.target)" class="mr-1">
            Decrease
          </b-button>
        </template>
      </b-table>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'ShopCart',
  data () {
    return {
      form: {
        groceries: '',
        fridge: '',
        amount: 1,
        checked: []
      },
      foods: [
        { text: 'Select One', value: null },
        'Carrots', 'Beans', 'Tomatoes', 'Corn'
      ],
      fridges: [
        { text: 'Select One', value: null },
        'Fridge1', 'Fridge2'
      ],
      show: true,
      used_list: [],
      fields: [
        {
          key: 'grocery',
          label: 'Groceries',
          sortable: true
        },
        {
          key: 'fridge',
          label: 'Fridges',
          sortable: true
        },
        {
          key: 'amount',
          label: 'Amounts',
          sortable: true,
          // Variant applies to the whole column, including the header and footer
          variant: 'success'
        },
        { key: 'actions', label: 'Actions' }
      ],
      items: [
      ]
    }
  },
  created: function () {
    this.items = JSON.parse(localStorage.getItem('vue_shopping_cart'))
  },
  watch: {
    items: function (val) {
      var vm = this
      vm.foods.forEach(function (ele, index) {
        if (index !== 0) {
          var itemFlg = false
          var usedFlg = false
          var usedIdx
          val.forEach(function (item, idx) {
            if (item['grocery'] === ele) {
              itemFlg = true
            }
          })
          vm.used_list.forEach(function (used, id) {
            if (used === ele) {
              usedFlg = true
              usedIdx = id
            }
          })
          if (!itemFlg && !usedFlg) {
            vm.used_list.push(ele)
          } else if (itemFlg && usedFlg) {
            vm.used_list.splice(usedIdx, 1)
          }
        }
      })
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i]['grocery'] === this.form['groceries'] && this.items[i]['fridge'] === this.form['fridge']) {
          if (this.items[i]['amount'] === 'used up') {
            this.items[i]['amount'] = this.form['amount']
          } else {
            this.items[i]['amount'] += this.form['amount']
          }
          localStorage.setItem('vue_shopping_cart', JSON.stringify(this.items))
          return
        }
      }
      this.items.push({
        isActive: true,
        amount: this.form['amount'],
        grocery: this.form['groceries'],
        fridge: this.form['fridge']
      })
      localStorage.setItem('vue_shopping_cart', JSON.stringify(this.items))
    },
    decrease (item, index, button) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i]['grocery'] === item.grocery && this.items[i]['fridge'] === item.fridge) {
          if (this.items[i]['amount'] === 1) {
            this.items.splice(i, 1)
          } else {
            this.items[i]['amount']--
          }
          localStorage.setItem('vue_shopping_cart', JSON.stringify(this.items))
          return
        }
      }
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      this.form.groceries = ''
      this.form.fridge = ''
      this.form.amount = null
      this.form.checked = []
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    }
  }
}
</script>
