import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "533967b9582a287b8295be661b466369";

const icons = {
	Clouds: "cloudy",
	Clear: "day-sunny",
	Rain: "rain",
	Snow: "snow",
};

export default function App() {
	const [city, setCity] = useState("Loading...");
	const [days, setDays] = useState([]);
	const [ok, setOk] = useState(true);
	const getWeather = async () => {
		const { granted } = await Location.requestForegroundPermissionsAsync();
		if (!granted) {
			setOk(false);
		}
		const {
			coords: { latitude, longitude },
		} = await Location.getCurrentPositionAsync({ accuracy: 5 });
		const location = await Location.reverseGeocodeAsync(
			{ latitude, longitude },
			{ useGoogleMaps: false },
		);
		setCity(location[0].city);
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${API_KEY}&units=metric`,
		);
		const json = await response.json();
		setDays(json.daily);
	};
	useEffect(() => {
		getWeather();
	}, []);
	return (
		<View style={styles.container}>
			<View style={styles.city}>
				<Text style={styles.cityName}>{city}</Text>
			</View>
			<ScrollView
				pagingEnabled
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.weather}>
				{days.lenghth === 0 ? (
					<View style={styles.day}>
						<ActivityIndicator
							color="white"
							style={{ marginTop: 10 }}
							size="large"
						/>
					</View>
				) : (
					days.map((day, index) => (
						<View key={index} style={styles.day}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									width: "100%",
									justifyContent: "space-between",
								}}>
								<Text style={styles.temp}>
									{parseFloat(day.temp.day).toFixed(1)}
								</Text>
								<Fontisto
									name={icons[day.weather[0].main]}
									size={60}
									color="black"
								/>
							</View>
							<Text style={styles.description}>{day.weather[0].main}</Text>
							<Text style={styles.tinyText}>{day.weather[0].description}</Text>
						</View>
					))
				)}
			</ScrollView>
		</View>
	);
}

// Styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "tomato",
	},
	city: {
		flex: 1.2,
		justifyContent: "center",
		alignItems: "center",
	},
	cityName: {
		fontSize: 58,
		fontWeight: "500",
	},
	weather: {},
	day: {
		width: SCREEN_WIDTH,
		alignItems: "center",
	},
	temp: {
		marginTop: 50,
		fontWeight: "600",
		fontSize: 178,
	},
	description: {
		marginTop: -30,
		fontSize: 60,
	},
	tinyText: {
		fontSize: 20,
	},
});
