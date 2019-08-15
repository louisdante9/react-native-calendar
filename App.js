import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { Agenda } from 'react-native-calendars';
import axios from 'axios';

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
    };
  }

  async componentDidMount() {
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik4wVXpORU0yUWpFNE9UWXpNVU5FTWpSRk5VSTJRVUpFUlVReU16WXlNRVk0UVRFNE9UTXlOUSJ9.eyJodHRwczovL2FscGFrYS5pby90b2tlbiI6eyJ2Ijo0LCJ0cGUiOiJ1c2VyIiwicmVmIjoiYXV0aCIsImNpZCI6MiwiY24iOiJBbHBha2EiLCJ0biI6ImFscGFrYSIsInVpZCI6MjE3NCwidW4iOiJDaGFycGVsbGUgVW1laCIsInVnbiI6IkNoYXJwZWxsZSIsInVmbiI6IlVtZWgiLCJpbWciOiJodHRwczovL3MzLWV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2FscGFrYS1pbWcvYW5vbnltb3VzX1NRLmpwZyIsInRva2VuX3R5cGUiOiJ1c2VyIiwidGVuYW50X3VyaSI6ImFscGFrYSIsInRlbmFudF9pZCI6IjIifSwiaXNzIjoiaHR0cHM6Ly9zaWduaW4uYWxwYWthLmlvLyIsInN1YiI6ImF1dGgwfDIxNzQiLCJhdWQiOlsidXJuOmFwaS5hbHBha2EuaW86djM6OnVuaXZlcnNhbCIsImh0dHBzOi8vcGxhY2Vwb3NpdGlvbi5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTY1OTAyMjM3LCJleHAiOjE1NjU5ODg2MzcsImF6cCI6IlVsRXpRS1dEcDdqRnV5NUtvc3NidjNIZzVPam1vWU1EIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBvZmZsaW5lX2FjY2VzcyJ9.j6SkOv4Drn4D9C-1F1PNQJUKCd8G2WlbuYoKwLx-L0Ul8DVw9HOmcbZLjqCGltCVrQPL4u3O26WJ2G0Ilb3UXEoQdtZEHpZW4MqrY2DxDA2cIT8opTt8zI229LYVuBFb8aLbMzih1YItlF8XvID5YPuAkywfYPgHduah7FNUph9HUC4W5mLm2veCBOOp9lmABUCh0hFF1YOiCIYybAVG46kLDeAee0l12G3svCbOEEoduXqpGG3FoOT8nxOISUEKeMMdwdY5iZ0rzsgiO_vLBuOxdSDjvG32m7uqS5JXpRAcBgr-DRNLMzWQ86yd9F51ws8blev4XPvAhLMR_qrLxA"

    var config = {
      headers: { 'Authorization': "Bearer " + token }
    };
    const { data: appointments } = await axios.get('https://alpaka.alpaka.io/api/v3/schedules/user/2174', config);

    /**
     * @method: map - 
     * @description: this maps through the response and produces a data in an object form.
     * 
     * @method: reduce - 
     * @description: merges all data for similar dates 
     * 
     */
    const schedule = appointments.map((appointment) => {
      const { scheduleStart, scheduleEnd, scheduleName } = appointment
      const strDate = moment.unix(scheduleStart).format("YYYY-MM-DD");
      const strTime = moment.unix(scheduleStart).utc().format('HH:mm A');
      const endTime = moment.unix(scheduleEnd).add(60, 'seconds').utc().format('hh:mm A');
      return { key: strDate, value: [{ name: scheduleName, str: strTime, end: endTime }] }
    }).reduce((function (hash) {
      return function (array, obj) {
        if (!hash[obj.key])
          array.push(hash[obj.key] = obj);
        else
          hash[obj.key].value.push(...obj.value);
        return array;
      };
    })({}), []);

    /**
     * @method: reduce 
     * @description: convert array to an object need for the calendar module.
     */
    const scheduleData = schedule.reduce((obj, item) => {
      obj[item.key] = item.value
      return obj
    }, {})
    this.setState({
      items: scheduleData,
    })
  }


  render() {
    return (
      <Agenda
        items={this.state.items}
        renderItem={this.renderItem.bind(this)}
        // renderEmptyDate={this.renderEmptyDate.bind(this)}
        renderEmptyData={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        theme={{
          selectedDayBackgroundColor: '#ff4a00',
          todayTextColor: '#ff4a00',
          dotColor: '#ff4a00',
          textDayFontWeight: '300',
          agendaDayTextColor: '#ff4a00',
          agendaDayNumColor: '#ff4a00',
          agendaKnobColor: '#ff4a00'
        }}
      />
    );
  }

  
  renderItem(item) {
    return (
      <View style={[styles.item]}>
        <Text style={{color: '#ff4a00', opacity: 0.7}}>{item.str} - {item.end}</Text>
        <Text style={{fontSize: 17}}>{item.name}</Text>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text></Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }


}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 30,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});