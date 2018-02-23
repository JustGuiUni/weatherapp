// import preact
import { h, render, Component } from 'preact';
import $ from 'jquery';
import Relocate from '../topnav/relocate_index';
import Search from '../topnav/search_index';
import style_topnav from '../topnav/style_topnav';
	
export default class Home extends Component {

	// fetch starting weather data
	componentDidMount() {
	if (this.state.temp === "") {
			this.fetchWeatherData();
		}
	}

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature, long, lat initialise state
		this.state.temp = "";
		this.state.lon = "-0.03749985";
		this.state.lat = "51.520497918";
		this.state.icon = "";
		// this.state.postcodeVal = "";
		// button display state
		// this.setState({ display: true });
		this.updateInputValue = this.updateInputValue.bind(this);
	}

	// a call to fetch weather data via open weather map
	fetchWeatherData = () => {

		var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + this.state.lat + "&lon=" + this.state.lon + "&appid=fb1dc4da37f9e2330043b353f437dea9";
		$.ajax({
			url: url,
			dataType: "json",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})

	}

	// parse relevant fields from Open Weather Map API resposne, for later rendering
	parseResponse = (parsed_json) => {
		var location = parsed_json['name'];
		var temp_c = Math.round((parsed_json['main']['temp']-273.15) * 10) / 10;
		var wind_speed = parsed_json['wind']['speed'];
		var wind_direction = parsed_json['wind']['deg'];
		var conditions = parsed_json['weather'][0]['id'];

		// call two additional helper functions to parse numeric values for wind direction and conditions into English
		var cond_icon = this.parseConditions(conditions);
		conditions = cond_icon[0];
		this.state.icon = cond_icon[1];
		wind_direction = this.parseWind(wind_direction);

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c + "°",
			cond : conditions,
			winds : wind_speed + "m/s",
			windd: wind_direction
		});      
	}


	// Open Weather Map uses an id code to indicate weather conditions
	// This function converts an id code into an English language description and sets the appropriate icon
	parseConditions = (c) => {
		var i = "";

		if (200 <= c && c <= 232){
			c = "Thunderstorm";
			i = "fa fa-bolt";
		} else if (300 <= c && c <= 321){
			c = "Drizzle";
			i = "fa fa-tint";
		} else if (c == 500 || c == 520){
			c = "Light Rain";
			i = "fa fa-tint";
		} else if (c == 501 || c == 521){
			c = "Moderate Rain";
			i = "fa fa-tint";
		} else if ((502 <= c && c <= 504) || (522 <= c && c <= 531)){
			c = "Heavy Rain";
			i = "fa fa-tin";
		} else if (c == 511){
			c = "Freezing Rain";
			i = "fa fa-tint";
		} else if (600 <= c && c <= 622){
			c = "Snow";
			i = "fa fa-snowflake";
		} else if (701 == c) {
			c = "Mist";
			i = "fa fa-align-justify";
		} else if (721 == c) {
			c = "Haze";
			i = "fa fa-align-justify";
		} else if (741 == c) {
			c = "Fog";
			i = "fa fa-align-justify";
		} else if (800 == c) {
			c = "Clear Sky"
			i = "fa fa-sun-o";
		} else {
			c = "Clouds";
			i = "fa fa-cloud";
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

	// The below function makes a call to postcodes.io based on the postcode value inputed by the user. 
	// It also then calls the fetchWeatherData function.
	postcodeSearch = () =>{
		
		var postcode = this.state.postcodeVal;
		console.log(postcode);

		var url = "https://api.postcodes.io/postcodes/" + postcode;

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, false);
		xhr.send();
		console.log(xhr.responseText);

		var JSONresponse = JSON.parse(xhr.responseText);

		this.state.lon = JSONresponse['result']['longitude'];
		this.state.lat = JSONresponse['result']['latitude'];

		console.log(this.state.lat);

		this.fetchWeatherData();

	}

	// This function reads data from the text input on any update and sets the class variable postcode to that value. 
	updateInputValue(evt){
	    this.state.postcodeVal = evt.target.value;
	    console.log(this.state.postcodeVal);
	}

	// Reset coordinates when user presses the crosshair button
	resetCoordinates = () =>{
		this.state.lon = "-0.03749985";
		this.state.lat = "51.520497918";
		this.fetchWeatherData();
	}

	render() {

		return (
			<div>
				<div class={ style_topnav.container }>
					
					{/* Reset coordinates when user presses the crosshair button */}
					<Relocate clickFunction={ this.resetCoordinates }/>
					
					{/* Update text input and coordinates when user makes a search*/}
					<input type="text" placeholder="Postcode..." id="searchField"  onChange ={ this.updateInputValue }></input>
					<Search clickFunction ={ this.postcodeSearch } />	
						
					{/* Settings button has no functionality currently */}
					<buttonright><i class="fa fa-cog"></i></buttonright>	
				</div>
			
				<current>
					<weather-location> {this.state.locate} </weather-location>				
					<weather-icon><br />
						<div style="font-size: 120px;">
							<i class= {this.state.icon}></i>
						</div>
						{this.state.cond}
					</weather-icon>
					
					{/* Display temperature, wind speed, wind direction*/}
					<weather-text> 
						<br /><sub-icon><i class="fa fa-thermometer"></i></sub-icon>{this.state.temp} 
						<br /><sub-icon><i class="fa fa-align-right"></i></sub-icon>{this.state.winds} 
						<br /><sub-icon><i class="fa fa-compass"></i></sub-icon>{this.state.windd}
					</weather-text>
				</current>
			</div>
		)
	}
}