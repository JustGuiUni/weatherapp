// import preact
import { h, render, Component } from 'preact';
import $ from 'jquery';
	
export default class Routeforecast extends Component {

	componentDidMount() {
		if(document.getElementById("details")){
			var element = document.getElementById("details");
		    element.id = this.props.detailsid;
	    }
	    if(document.getElementById("icon")){
	    	var icon = document.getElementById("icon");
	    	icon.id = this.props.iconid;
	    }
	}

	// set initial values for the route
	constructor(props){
		super(props);
		this.state.temp1 = "";
		this.state.count = 0;
		this.expand = this.expand.bind(this);
		this.state.clicked = Boolean(false);
	}

	// a call to fetch weather forecasts for each end of the route via open weather map
	fetchForecastData = () => {
		
		var url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + this.props.lat1 + "&lon=" + this.props.lon1 + "&appid=fb1dc4da37f9e2330043b353f437dea9";
		$.ajax({
			url: url,
			dataType: "json",
			async: false,
			success : this.parseForecastResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})

		this.state.count = 1;

		url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + this.props.lat2 + "&lon=" + this.props.lon2 + "&appid=fb1dc4da37f9e2330043b353f437dea9";
		$.ajax({
			url: url,
			dataType: "json",
			async: false,
			success : this.parseForecastResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})

		this.state.count =0;
	}

	// parse relevant fields from Open Weather Map API response, for later rendering
	parseForecastResponse = (parsed_json) => {
		var forecast_list = parsed_json['list'];

		for (var i = 0; i < forecast_list.length; i++) {
			if (this.state.count == 0) {
				if ((forecast_list[i]['dt_txt']).indexOf(this.props.time1) > 0) {
					var forecast = forecast_list[i];
					break;
				}
			} else {
				if ((forecast_list[i]['dt_txt']).indexOf(this.props.time2) > 0) {
					var forecast = forecast_list[i];
					break;
				}
			}
		}

		var temp_c = Math.round((forecast['main']['temp']-273.15) * 10) / 10;
		var wind_speed = forecast['wind']['speed'];
		var wind_direction = forecast['wind']['deg'];
		var conditions = forecast['weather'][0]['id'];
		var sunstate = forecast['sys']['pod'];

		// call two additional helper functions to parse numeric values for wind direction and conditions into English
		var cond_icon = this.parseConditions(conditions, sunstate);
		conditions = cond_icon[0];
		var icon = cond_icon[1];
		wind_direction = this.parseWind(wind_direction);

		// set states for fields so they could be rendered later on
		if (this.state.count == 0) {
			this.state.temp1 = temp_c + "°";
			this.state.cond1 = conditions;
			this.state.winds1 = wind_speed + "m/s";
			this.state.windd1 = wind_direction;
			this.state.icon1 = icon;
		} else {
			this.state.temp2 = temp_c + "°";
			this.state.cond2 = conditions;
			this.state.winds2 = wind_speed + "m/s";
			this.state.windd2 = wind_direction;
			this.state.icon2 = icon;
		}      
	}


	// Open Weather Map uses an id code to indicate weather conditions
	// This function converts an id code into an English language description and sets the appropriate icon
	parseConditions = (c, sunstate) => {

		var i = "";

		if (200 <= c && c <= 232){
			c = "Thunderstorm";
			if (sunstate == "d") {
				i = "wi wi-day-thunderstorm";
			} else {
				i = "wi wi-night-alt-thunderstorm";
			}
		} else if (300 <= c && c <= 321){
			c = "Drizzle";
			if (sunstate == "d") {
				i = "wi wi-day-showers";
			} else {
				i = "wi wi-night-alt-showers";
			}
		} else if (c == 500 || c == 520){
			c = "Light Rain";
			if (sunstate == "d") {
				i = "wi wi-day-showers";
			} else {
				i = "wi wi-night-alt-showers";
			}
		} else if (c == 501 || c == 521){
			c = "Moderate Rain";
			if (sunstate == "d") {
				i = "wi wi-day-showers";
			} else {
				i = "wi wi-night-alt-showers";
			}
		} else if ((502 <= c && c <= 504) || (522 <= c && c <= 531)){
			c = "Heavy Rain";
			if (sunstate == "d") {
				i = "wi wi-day-rain";
			} else {
				i = "wi wi-night-alt-rain";
			}
		} else if (c == 511){
			c = "Freezing Rain";
			if (sunstate == "d") {
				i = "wi wi-day-sleet";
			} else {
				i = "wi wi-night-alt-sleet";
			}
		} else if (600 <= c && c <= 622){
			c = "Snow";
			if (sunstate == "d") {
				i = "wi wi-day-snow";
			} else {
				i = "wi wi-night-alt-snow";
			}
		} else if (701 == c) {
			c = "Mist";
			if (sunstate == "d") {
				i = "wi wi-day-fog";
			} else {
				i = "wi wi-night-fog";
			}
		} else if (721 == c) {
			c = "Haze";
			if (sunstate == "d") {
				i = "wi wi-day-haze";
			} else {
				i = "wi wi-night-fog";
			}
		} else if (741 == c) {
			c = "Fog";
			if (sunstate == "d") {
				i = "wi wi-day-fog";
			} else {
				i = "wi wi-night-fog";
			}
		} else if (800 == c) {
			c = "Clear Sky"
			if (sunstate == "d") {
				i = "wi wi-day-sunny";
			} else {
				i = "wi wi-night-clear";
			}
		} else {
			c = "Clouds";
			if (sunstate == "d") {
				i = "wi wi-day-cloudy";
			} else {
				i = "wi wi-night-alt-cloudy";
			}
		}		
		return [c,i];
	}

	// Open Weather Map uses degrees from North for wind direction
	// This function converts degress from North into an 8-point-compass direction
	parseWind = (w) => {
		if (22.5 < w && w <= 67.5) {
			w = "NE";
		} else if (67.5 < w && w <= 112.5) {
			w = "E";
		} else if (112.5 < w && w <= 157.5) {
			w = "SE";
		} else if (157.5 < w && w <= 202.5) {
			w = "S";
		} else if (202.5 < w && w <= 247.5) {
			w = "SW";
		} else if (247.5 < w && w <= 292.5) {
			w = "W";
		} else if (292.5 < w && w <= 337.5) {
			w = "NW";
		} else {
			w = "N";
		}

		return w;		
	}

	expand() {
	    var element = document.getElementById(this.props.detailsid);
	    if (element.style.display === "none") {
	        element.style.display = "inline-block";
	    } else {
	        element.style.display = "none";
	    }

		var icon = document.getElementById(this.props.iconid);
		if(icon.className == "fa fa-chevron-circle-down") {
			icon.className = "fa fa-chevron-circle-up";
			console.log(icon.className);
		} else {
			icon.className = "fa fa-chevron-circle-down";
		}
	}

	// The elements to render when this component mounts
	render() {
		
		if (this.state.temp1 === "") {
			this.fetchForecastData();
		}

		return (
			<route>
				<name>{this.props.title}</name>
				<dropdown onClick={this.expand}><i id="icon" class="fa fa-chevron-circle-down"/></dropdown>
				<route-text>{this.props.name1}: {this.props.timed1}</route-text>
				<route-text>{this.props.name2}: {this.props.timed2}</route-text>
				<route-graphics>
					<route-icon><i class= {this.state.icon1}></i></route-icon>
					<line/>
					<route-icon><i class= {this.state.icon2}></i></route-icon>
				</route-graphics>
				<route-text>{this.state.temp1}</route-text>
				<route-text>{this.state.temp2}</route-text>
				<route-details id="details" style="display: none">
						<detail-text>{this.state.cond1}<br />{this.state.winds1}<br />{this.state.windd1}</detail-text>
						<detail-icon><i class="wi wi-strong-wind"/><br /><i class="fa fa-compass"/></detail-icon>
						<detail-text>{this.state.cond2}<br />{this.state.winds2}<br />{this.state.windd2}</detail-text>
				</route-details>
			</route>
		);
	}
}