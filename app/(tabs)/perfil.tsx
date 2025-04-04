import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Alert,
  StatusBar,
  Platform,
  ScrollView,
  Dimensions,
  ViewStyle,
  TextStyle
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera as ExpoCamera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Detectar si estamos en entorno web
const isWeb = Platform.OS === 'web';

// Obtener dimensiones de la ventana
const windowDimensions = Dimensions.get("window");

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: 'Cargando...',
    profileImage: 'https://via.placeholder.com/150',
    membership: 'Premium',
    status: 'Activo',
    expiration: '28 de abril, 2025',
    timeRemaining: 55, // porcentaje restante de membresía
  });
  
  const [hasPermission, setHasPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);

  // Cargar datos del usuario desde AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");
        const photo = await AsyncStorage.getItem("photo");
        const name = await AsyncStorage.getItem("name"); 

        if (userId !== null && token !== null) {
          console.log("User ID:", userId);
          console.log("Token:", token);
          console.log("Photo:", photo);
          console.log("Name:", name);
          
          // Actualizar el estado del usuario con los datos almacenados
          setUser(prevUser => ({
            ...prevUser,
            name: name || prevUser.name,
            profileImage: `https://gsoft.gallegosb.xyz/api/${photo}` || prevUser.profileImage
          }));
        }
      } catch (error) {
        console.error("Error al obtener datos de AsyncStorage", error);
      }
    };

    getUserData();
  }, []);

  // Solicitar permisos al cargar el componente
  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Función para abrir opciones de cambio de imagen
  const handleChangeProfileImage = () => {
    Alert.alert(
      'Cambiar foto de perfil',
      '¿Cómo deseas cambiar tu foto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Tomar foto con cámara',
          onPress: () => setShowCamera(true)
        },
        {
          text: 'Elegir de galería',
          onPress: pickImageFromGallery
        }
      ]
    );
  };

  // Función para seleccionar imagen de la galería
  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Se requieren permisos para acceder a la galería');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      // Actualizar la imagen en el estado y guardarla en AsyncStorage
      const newImageUri = result.assets[0].uri;
      setUser({ ...user, profileImage: newImageUri });
      
      try {
        await AsyncStorage.setItem("photo", newImageUri);
      } catch (error) {
        console.error("Error al guardar la foto en AsyncStorage", error);
      }
    }
  };

  // Función para tomar foto con la cámara
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          skipProcessing: true,
        });
        
        // Actualizar la imagen en el estado y guardarla en AsyncStorage
        setUser({ ...user, profileImage: photo.uri });
        
        try {
          await AsyncStorage.setItem("photo", photo.uri);
        } catch (error) {
          console.error("Error al guardar la foto en AsyncStorage", error);
        }
        
        setShowCamera(false);
      } catch (error) {
        console.error('Error al tomar la foto:', error);
        Alert.alert('No se pudo tomar la foto');
      }
    }
  };

  // Renderizar elementos de acción
  const renderActionButtons = () => {
    const actions = [
      { icon: 'payment', text: 'Pagos' },
      { icon: 'schedule', text: 'Horarios' },
      { icon: 'fitness-center', text: 'Clases' },
      { icon: 'history', text: 'Historial' }
    ];

    return (
      <View style={styles.actionButtons}>
        {actions.map((action, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.actionButton,
              index === 0 ? { marginLeft: 0 } : null,
              index === actions.length - 1 ? { marginRight: 0 } : null
            ]}
          >
            <MaterialIcons name={action.icon} size={24} color="#FFA500" />
            <Text style={styles.actionButtonText}>{action.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Renderizar beneficios
  const renderBenefits = () => {
    const benefits = [
      'Acceso ilimitado a todas las instalaciones',
      'Clases premium incluidas',
      'Entrenador personal 2 veces por semana',
      'Acceso a la app móvil exclusiva'
    ];

    return (
      <View style={styles.benefitsSection}>
        <Text style={styles.sectionTitle}>Beneficios de tu membresía</Text>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <MaterialIcons name="check-circle" size={20} color="#FFA500" />
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Si no hay permisos de cámara, mostrar mensaje
  if (hasPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={60} color="#FFA500" />
        <Text style={styles.errorText}>No hay acceso a la cámara</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Solicitar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renderizar cámara si está activa
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <ExpoCamera
          style={styles.camera}
          type={ExpoCamera.Constants.Type.front}
          ref={cameraRef}
        >
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowCamera(false)}
            >
              <MaterialIcons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </ExpoCamera>
      </View>
    );
  }

  // Renderizar pantalla de perfil normal
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.gymName}>PERFIL DE USUARIO</Text>
          </View>
          <View style={styles.divider} />

          {isWeb ? (
            <View style={styles.webContainer}>
              <View style={styles.webLeftColumn}>
                <View style={styles.mainCard}>
                  <View style={styles.profileHeader}>
                    <View style={styles.profileImageContainer}>
                      <Image
                        source={{ uri: user.profileImage }}
                        style={styles.profileImage}
                      />
                      <TouchableOpacity
                        style={styles.changePhotoButton}
                        onPress={handleChangeProfileImage}
                      >
                        <MaterialIcons name="camera-alt" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.userName}>{user.name}</Text>
                    
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(46, 204, 113, 0.15)' }]}>
                      <View style={[styles.statusDot, { backgroundColor: '#2ECC71' }]} />
                      <Text style={[styles.statusText, { color: '#2ECC71' }]}>{user.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.mainCardContent}>
                    <View style={styles.membershipDetail}>
                      <MaterialIcons name="card-membership" size={24} color="#FFA500" />
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Tipo de Membresía</Text>
                        <Text style={styles.detailValue}>{user.membership}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.membershipDetail}>
                      <MaterialIcons name="event" size={24} color="#FFA500" />
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Fecha de Expiración</Text>
                        <Text style={styles.detailValue}>{user.expiration}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.timeRemainingContainer}>
                      <View style={styles.progressBarContainer}>
                        <View 
                          style={[
                            styles.progressBar,
                            { width: `${user.timeRemaining}%`, backgroundColor: '#FFA500' }
                          ]} 
                        />
                      </View>
                      <Text style={styles.timeRemainingText}>
                        Te quedan {user.timeRemaining}% días de membresía
                      </Text>
                    </View>
                  </View>
                </View>
                
                {renderActionButtons()}
              </View>
              
              <View style={styles.webRightColumn}>
                {renderBenefits()}
              </View>
            </View>
          ) : (
            // Vista móvil
            <>
              <View style={styles.mainCard}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={{ uri: user.profileImage }}
                      style={styles.profileImage}
                    />
                    <TouchableOpacity
                      style={styles.changePhotoButton}
                      onPress={handleChangeProfileImage}
                    >
                      <MaterialIcons name="camera-alt" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.userName}>{user.name}</Text>
                  
                  <View style={[styles.statusBadge, { backgroundColor: 'rgba(46, 204, 113, 0.15)' }]}>
                    <View style={[styles.statusDot, { backgroundColor: '#2ECC71' }]} />
                    <Text style={[styles.statusText, { color: '#2ECC71' }]}>{user.status}</Text>
                  </View>
                </View>
                
                <View style={styles.mainCardContent}>
                  <View style={styles.membershipDetail}>
                    <MaterialIcons name="card-membership" size={24} color="#FFA500" />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Tipo de Membresía</Text>
                      <Text style={styles.detailValue}>{user.membership}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.membershipDetail}>
                    <MaterialIcons name="event" size={24} color="#FFA500" />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Fecha de Expiración</Text>
                      <Text style={styles.detailValue}>{user.expiration}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.timeRemainingContainer}>
                    <View style={styles.progressBarContainer}>
                      <View 
                        style={[
                          styles.progressBar,
                          { width: `${user.timeRemaining}%`, backgroundColor: '#FFA500' }
                        ]} 
                      />
                    </View>
                    <Text style={styles.timeRemainingText}>
                      Te quedan {user.timeRemaining}% días de membresía
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingTop: Platform.select({
      android: StatusBar.currentHeight || 0,
      ios: 0,
      web: 0
    }),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
    ...(isWeb && {
      overflow: 'auto',
    }),
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0D0D0D",
    paddingBottom: Platform.select({
      android: 5,
      ios: 5,
      web: 5
    }),
    paddingTop: Platform.select({
      android: 15,
      ios: 0,
      web: 0
    }),
    ...(isWeb && {
      maxWidth: 1200,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: Platform.select({
      android: 10,
      ios: 0,
      web: 0
    }),
  },
  gymName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 10,
    textAlign: "center",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 26,
    }),
  },
  divider: {
    height: 3,
    backgroundColor: "#FFA500",
    width: 60,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 1,
    ...(isWeb && windowDimensions.width > 768 && {
      width: 80,
    }),
  },
  mainCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
    elevation: 4, // Sombras para Android
    shadowColor: "#000", // Sombras para iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    ...(isWeb && {
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      maxWidth: windowDimensions.width > 768 ? 800 : '100%',
      marginHorizontal: 'auto',
    }),
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFA500',
    backgroundColor: '#333', // Color de fondo mientras carga la imagen
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: "#FFA500",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  mainCardContent: {
    marginTop: 15,
  },
  membershipDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  detailTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    color: "#999",
    fontSize: 14,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 15,
    }),
  },
  detailValue: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 18,
    }),
  },
  timeRemainingContainer: {
    marginTop: 15,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
    ...(isWeb && windowDimensions.width > 768 && {
      height: 8,
    }),
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  timeRemainingText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 15,
    }),
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    ...(isWeb && windowDimensions.width < 768 && {
      flexWrap: 'wrap',
    }),
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    elevation: 2, // Sombras para Android
    shadowColor: "#000", // Sombras para iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      minWidth: 120,
    }),
    ...(isWeb && windowDimensions.width < 768 && {
      flex: 0,
      width: '48%',
      marginBottom: 10,
    }),
  },
  actionButtonText: {
    color: "#FFF",
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 14,
    }),
  },
  benefitsSection: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
    elevation: 2, // Sombras para Android
    shadowColor: "#000", // Sombras para iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    ...(isWeb && {
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      maxWidth: windowDimensions.width > 768 ? 800 : '100%',
      marginHorizontal: 'auto',
    }),
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 18,
    }),
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    color: "#FFF",
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 16,
    }),
  },
  // Estilos para la cámara
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
    padding: 20,
  },
  errorText: {
    color: "#FFA500",
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 18,
    }),
  },
  retryButton: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3, // Sombras para Android
    shadowColor: "#000", // Sombras para iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
  retryButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  ...(isWeb && {
    webContainer: {
      display: 'flex',
      flexDirection: windowDimensions.width > 1024 ? 'row' : 'column',
      justifyContent: 'space-between',
      width: '100%',
      gap: 20,
    },
    webLeftColumn: {
      flex: windowDimensions.width > 1024 ? 2 : 'auto',
      marginRight: windowDimensions.width > 1024 ? 10 : 0,
    },
    webRightColumn: {
      flex: windowDimensions.width > 1024 ? 1 : 'auto',
      marginLeft: windowDimensions.width > 1024 ? 10 : 0,
    },
  }),
});