// NOTE: This logic should be implemented
// in redis or any other key-value storage database
// that is able to scale
//
// Table obj structure:
// {
//    id: UUID.v4(),
//    name: String,
//  	createdDate: Date,
//  	tableLimit: {
//    	money: Number,
//    	players: Number
//  	},
//  	numberOfDecks: Number
// 		sittingPlayers: [{
//   		userId: Schema.Types.ObjectId,
//   		money: Number
// 		}],
//   	cards: Array
// }
//

// Dependencies
var HashMap = require('hashmap');

var store = new HashMap();
module.exports = store;
