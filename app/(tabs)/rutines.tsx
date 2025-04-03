import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform, Share } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import * as MediaLibrary from "expo-media-library";
import { styles } from "@/src/rutines/presentation/styles";
import * as Permissions from 'expo-permissions';

const BASE_URL = "https://gsoft.gallegosb.xyz/api";

interface ApiRoutine {
  id: string;
  tipo: string;
  description: string;
  url_rutina: string;
  id_gimnacio: string;
}

interface ApiResponse {
  status: boolean;
  data: {
    data: ApiRoutine[];
    total: number;
  };
}

interface FormattedRoutine {
  id: string;
  title: string;
  level: string;
  duration: string;
  exercises: string;
  description: string;
  url_rutina: string;
}

interface RoutineCardProps {
  routine: FormattedRoutine;
}

const App = () => {
  const [routines, setRoutines] = useState<FormattedRoutine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutines();
    requestPermissions()
  }, []);

  async function requestPermissions() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitas permitir acceso a la galería para guardar archivos.');
      return false;
    }
    return true;
  }

  const fetchRoutines = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        setError("No hay sesión activa. Por favor inicia sesión nuevamente.");
        setLoading(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch('https://gsoft.gallegosb.xyz/api/routines/1', {
        method: 'GET',
        headers
      });
      
      const result: ApiResponse = await response.json();
      
      if (result.status && result.data.data) {
        const formattedData: FormattedRoutine[] = result.data.data.map(routine => ({
          id: routine.id,
          title: `Rutina ${routine.tipo}`,
          level: `Nivel ${getNivelByTipo(routine.tipo)}`,
          duration: "4-8 semanas",
          exercises: "Completa",
          description: routine.description,
          url_rutina: routine.url_rutina
        }));
        
        setRoutines(formattedData);
      } else {
        setError("No se pudieron cargar las rutinas");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getNivelByTipo = (tipo: string): number | string => {
    switch (tipo.toLowerCase()) {
      case "principiante": return 1;
      case "intermedio": return 2;
      case "avanzado": return 3;
      default: return "?";
    }
  };

  const handleDownload = async (url: string, title: string): Promise<void> => {
    try {
      if (Platform.OS === 'android') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permisos insuficientes', 'Se necesitan permisos para guardar archivos');
          return;
        }
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("No hay sesión activa. Por favor inicia sesión nuevamente.");
        return;
      }

      setLoading(true);
      Alert.alert("Descargando", "La rutina se está descargando...");

      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileName = `rutina_${cleanTitle}_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      const downloadResumable = FileSystem.createDownloadResumable(
        `${BASE_URL}${url}`,
        fileUri,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const { uri } = await downloadResumable.downloadAsync();
      if (!uri) throw new Error('La descarga falló');

      setLoading(false);

      if (Platform.OS === 'ios') {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            UTI: 'com.adobe.pdf',
            mimeType: 'application/pdf',
          });
        } else {
          Alert.alert("Descarga Completa", `Tu rutina se ha descargado en: ${uri}`);
        }
      } else if (Platform.OS === 'android') {
        try {
          console.log("Intentando guardar el archivo en:", uri);
          const asset = await MediaLibrary.createAssetAsync(uri);
          const album = await MediaLibrary.getAlbumAsync('Rutinas');

          if (!album) {
            await MediaLibrary.createAlbumAsync('Rutinas', asset, false);
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }

          Alert.alert(
            "Descarga Completa",
            "¿Qué quieres hacer con la rutina?",
            [
              { text: "Abrir", onPress: async () => {
                const contentUri = await FileSystem.getContentUriAsync(uri);
                await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                  data: contentUri,
                  flags: 1,
                  type: 'application/pdf'
                });
              }},
              { text: "Compartir", onPress: async () => {
                const contentUri = await FileSystem.getContentUriAsync(uri);
                await Share.share({ url: contentUri, title });
              }},
              { text: "Cerrar", style: "cancel" }
            ]
          );
        } catch (e) {
          console.error("Error guardando el archivo:", e);
          Alert.alert("Error", "No se pudo guardar el archivo en tu galería");
        }
      }
    } catch (err) {
      setLoading(false);
      console.error("Error al descargar la rutina:", err);
      Alert.alert("Error de descarga", "No se pudo descargar la rutina. Inténtalo nuevamente.");
    }
  };

  const RoutineCard = ({ routine }: RoutineCardProps) => (
    <View style={styles.cardContainer}>
      <LinearGradient colors={['#1a1a1a', '#111111']} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.levelIndicator}>
            <Text style={styles.levelText}>{routine.level}</Text>
          </View>
          <MaterialIcons name="fitness-center" size={26} color="#FFA500" />
        </View>
        <Text style={styles.cardTitle}>{routine.title}</Text>
        <Text style={styles.cardDescription}>{routine.description}</Text>
        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={() => handleDownload(routine.url_rutina, routine.title)}
        >
          <Text style={styles.downloadText}>Descargar Rutina</Text>
          <MaterialIcons name="cloud-download" size={22} color="#000" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Rutinas de Entrenamiento</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Escanea para acceder al gimnasio</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#f5a623" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={routines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RoutineCard routine={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default App;
