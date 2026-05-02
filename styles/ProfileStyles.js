import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    padding: 20,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  iconCircle: {
    padding: 10,
  },

  profileWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  info: {
    alignItems: 'center',
    marginTop: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  email: {
    color: 'gray',
  },

  menuContainer: {
    marginTop: 20,
    padding: 10,
  },

  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  menuText: {
    fontSize: 16,
  },

  logout: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  headerCard: {
  backgroundColor: '#fff',
  padding: 25,
  borderRadius: 20,
  alignItems: 'center',
  marginTop: 20,
  elevation: 5,
},

avatar: {
  width: 90,
  height: 90,
  borderRadius: 45,
  borderWidth: 3,
  borderColor: '#4F46E5',
  marginBottom: 10,
},

name: {
  fontSize: 20,
  fontWeight: '700',
},

email: {
  color: 'gray',
  marginTop: 3,
},

menuCard: {
  marginTop: 20,
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 10,
  elevation: 3,
},

menuItem: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 15,
  borderBottomWidth: 0.5,
  borderColor: '#eee',
},

menuIcon: {
  fontSize: 18,
  width: 30,
},

menuText: {
  flex: 1,
  fontSize: 15,
},

arrow: {
  fontSize: 20,
  color: 'gray',
},

logoutBtn: {
  marginTop: 25,
  backgroundColor: '#EF4444',
  padding: 15,
  borderRadius: 12,
  alignItems: 'center',
},

logoutText: {
  color: '#fff',
  fontWeight: '600',
},

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalBox: {
  width: 280,
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 15,
},

cancelBtn: {
  padding: 10,
},

confirmBtn: {
  backgroundColor: 'red',
  padding: 10,
  borderRadius: 8,
},
});