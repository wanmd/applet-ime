Component({
  properties: {
		showModel:{
			type:Boolean,
			value: false
		},
		title: {
			type: String,
			value: ''
		},
    text : {
      type : Array,
      value : []
    },
		end_title:{
			type:String,
			value:'iME爱迷官方'
		}
  },

  lifetimes : {
    
  },

  observers: {
    showModel() {
			this.setData({
				show:this.properties.showModel
			})
		}
  },
  ready(){
		
  },
  data: {
    show:false
  },

  methods: {
		confim(){
		  this.setData({show:false})
		}
  }
})
