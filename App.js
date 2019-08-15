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
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik4wVXpORU0yUWpFNE9UWXpNVU5FTWpSRk5VSTJRVUpFUlVReU16WXlNRVk0UVRFNE9UTXlOUSJ9.eyJodHRwczovL2FscGFrYS5pby90b2tlbiI6eyJ2Ijo0LCJ0cGUiOiJ1c2VyIiwicmVmIjoiYXV0aCIsImNpZCI6MiwiY24iOiJBbHBha2EiLCJ0biI6ImFscGFrYSIsInVpZCI6MjE3NCwidW4iOiJDaGFycGVsbGUgVW1laCIsInVnbiI6IkNoYXJwZWxsZSIsInVmbiI6IlVtZWgiLCJpbWciOiJodHRwczovL3MzLWV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2FscGFrYS1pbWcvYW5vbnltb3VzX1NRLmpwZyIsInRva2VuX3R5cGUiOiJ1c2VyIiwidGVuYW50X3VyaSI6ImFscGFrYSIsInRlbmFudF9pZCI6IjIifSwiaXNzIjoiaHR0cHM6Ly9zaWduaW4uYWxwYWthLmlvLyIsInN1YiI6ImF1dGgwfDIxNzQiLCJhdWQiOlsidXJuOmFwaS5hbHBha2EuaW86djM6OnVuaXZlcnNhbCIsImh0dHBzOi8vcGxhY2Vwb3NpdGlvbi5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTY1NzUwMzIwLCJleHAiOjE1NjU4MzY3MjAsImF6cCI6IlVsRXpRS1dEcDdqRnV5NUtvc3NidjNIZzVPam1vWU1EIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBvZmZsaW5lX2FjY2VzcyJ9.ANlIprqhMrR9duTdiIFfD7bTdo_Cx8yofQx6kjIafGhRVvSSPxSLYVNTnUibhs_Kdxs8e3f7Q4Ht9GhBZ5SQtlpIO-OKo3ZgUf6wZxuidUlvtLkGxDaHKRXi-zqvw-yCyBK1oeKYbiM4q4vFrxlI2PhXCVpjlacJ1Vk8Ne7wSpCJb4x885tyTv3KI7QXPQm_3BZ_SA9J3EJNSNaa-rh6KFfyUGLwFpXDYddfc-c8bvRtZSUp6IbwHG2UpVaXVMv__1pumjoH2idlZO5SjkpbIxUi69JGnOaUOEVUnKVZHSnGePiwsL51Rc8n7igh75QdIL7Iku_If5xf46jHVyUkpQ"

    var config = {
      headers: { 'Authorization': "Bearer " + token }
    };
    const {data: appointments} = await axios.get('https://alpaka.alpaka.io/api/v3/schedules/user/2174', config);

    const schedule = appointments.map((appointment) => {
      const {scheduleStart, scheduleEnd,scheduleName} = appointment
      const strDate = moment.unix(scheduleStart).format("YYYY-MM-DD");
      const strTime = moment.unix(scheduleStart).utc().format('HH:mm');
      const endTime = moment.unix(scheduleEnd).utc().format('HH:mm');
      return {key: strDate, value: [{name: scheduleName, str: strTime, end: endTime }]}
    }).reduce((function(hash){
      return function(array,obj){
        if(!hash[obj.key]) 
          array.push(hash[obj.key]=obj);
        else 
          hash[obj.key].value.push(...obj.value);
       return array;
      };    
   
   })({}),[])
   const scheduleData = schedule.reduce((obj, item) => {
    obj[item.key] = item.value
    return obj
  }, {})
    console.log(scheduleData, 'this is the response form the server!!!!')
    this.setState({
      items : scheduleData,
    })
  }


  render() {
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        // selected={'2018-05-16'}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        // renderEmptyData={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
      // markingType={'period'}
      // markedDates={{
      //    '2017-05-08': {textColor: '#666'},
      //    '2017-05-09': {textColor: '#666'},
      //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
      //    '2017-05-21': {startingDay: true, color: 'blue'},
      //    '2017-05-22': {endingDay: true, color: 'gray'},
      //    '2017-05-24': {startingDay: true, color: 'gray'},
      //    '2017-05-25': {color: 'gray'},
      //    '2017-05-26': {endingDay: true, color: 'gray'}}}
      // monthFormat={'yyyy'}
      // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
      //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
    );
  }

  loadItems(day) {
    // setTimeout(() => {
    //   for (let i = -15; i < 85; i++) {
    //     const time = day.timestamp + i * 24 * 60 * 60 * 1000;
    //     const strTime = this.timeToString(time);
    //     if (!this.state.items[strTime]) {
    //       this.state.items[strTime] = [];
    //       const numItems = Math.floor(Math.random() * 5);
    //       for (let j = 0; j < numItems; j++) {
    //         this.state.items[strTime].push({
    //           name: 'Item for ' + strTime,
    //           height: Math.max(50, Math.floor(Math.random() * 150))
    //         });
    //       }
    //     }
    //   }

    //   const newItems = {};
    //   Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });

    //   this.setState({
    //     items: newItems
    //   });
    // }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item]}>
        <Text>{item.str} - {item.end}</Text>
        <Text>{item.name}</Text>
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

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
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