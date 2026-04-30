import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3aa0b8',
    padding: 20,
  },

  header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 40,
  paddingHorizontal: 10,
},
leftHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

profilePic: {
  width: 40,
  height: 40,
  borderRadius: 20,
},


hello: {
  fontSize: 12,
  color: '#777',
},

name: {
  fontSize: 16,
  fontWeight: 'bold',
},


  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },

  enterHeader: {
  position: 'absolute',
  left: 0,
  right: 0,
  alignItems: 'center',
},

appName: {
  fontSize: 30,
  fontWeight: 'bold',
},

rightHeader: {
  flexDirection: 'row',
  gap: 10,
},
iconCircle: {
  width: 35,
  height: 35,
  borderRadius: 18,
  backgroundColor: '#eee',
  justifyContent: 'center',
  alignItems: 'center',
},

iconText: {
  fontSize: 16,
},

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },

  search: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    flex: 1,
    elevation: 2,
  },

  locationBoxRight: {
    backgroundColor: '#2c3e50',
    padding: 10,
    borderRadius: 15,
    width: 130,
    alignItems: 'center',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  seeAll: {
    color: '#3498db',
  },

  popularCard: {
    width: 260,
    height: 170,
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 4,
  },

  popularImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  popularContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 15,
  },

  hotelName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  hotelLocation: {
    color: '#ddd',
    fontSize: 12,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  price: {
    color: '#fff',
    fontWeight: 'bold',
  },

  ratingBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  chip: {
    backgroundColor: '#e0ecff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginTop: 10,
  },

  activeChip: {
    backgroundColor: '#035061',
  },

  dropdownRight: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 130,
    elevation: 5,
    zIndex: 999,
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },

  recommendCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    elevation: 3,
  },

  recommendImage: {
    width: '100%',
    height: 100,
    borderRadius: 15,
  },

  recommendName: {
    fontWeight: 'bold',
    marginTop: 5,
    color: '#2c3e50',
  },

  recommendPrice: {
    color: '#3498db',
  },
});