import {Colors} from 'assets/Colors'
import CommonText from 'components/CommonText'
import Header from 'components/Header'
import React, {useEffect, useRef, useState} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native'
import dayjs from 'dayjs'
import {Fonts} from 'assets/Fonts'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {convertDayToVN} from '../utils'
import CommonButton from 'components/Button'
import {serveRequestStore} from 'state/serveRequest/serveRequestStore'
import {navigate} from 'navigation/utils/navigationUtils'
dayjs.extend(customParseFormat)

interface ItemDate {
  title: string
  date: number
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
    marginTop: 30,
  },
  dateTime: {
    marginLeft: 16,
    color: Colors.textPrimary,
    fontSize: Fonts.fontSize[14],
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  title: {
    fontSize: Fonts.fontSize[16],
    fontFamily: Fonts.fontFamily.AvertaBold,
    lineHeight: 24,
    color: Colors.black,
  },
  itemChooseDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTime: {
    marginTop: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    shadowColor: '#22313F',
  },
  day: {
    lineHeight: 20,
    color: Colors.nobel,
    marginBottom: 14,
  },
  date: {
    lineHeight: 20,
    color: Colors.nobel,
  },
  textTime: {
    lineHeight: 24,
    color: Colors.nobel,
    marginRight: 6,
    marginTop: 12,
    marginBottom: 6,
  },
  itemTime: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: Dimensions.get('window').width / 7.2,
  },
  btDate: {
    width: 30,
    height: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  rowDuration: {
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHour: {
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  wrapperHours: {
    borderRadius: 8,
    backgroundColor: Colors.gallery,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  itemHour: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
    borderRadius: 8,
  },
  hour: {
    //
  },
  btContinue: {
    marginBottom: 40,
  },
  error: {
    color: Colors.red,
    marginTop: 8,
    marginLeft: 20,
  },
})

const Schedule = () => {
  const {updateSchedule} = serveRequestStore(state => state)
  const [currentDate, setCurrentDate] = useState(dayjs().get('date'))
  const [dayInMonth, setDayInMonth] = useState<ItemDate[]>([])
  const refScrollDay = useRef<ScrollView>(null)
  const [hours, setHours] = useState<string[]>([])
  const [hourSelected, setHourSelected] = useState<string>('')
  const [inValidTime, setInValidTime] = useState<boolean>(false)

  const onPressDate = (date: number) => () => {
    setCurrentDate(date)
    setHourSelected('')
  }

  const onPressHour = (item: string) => () => {
    setHourSelected(item)
    setInValidTime(false)
  }

  const onPressContinue = () => {
    const isDisableHour = dayjs(
      `${currentDate} ${hourSelected}`,
      'DD HH:mm',
    ).isBefore(dayjs())
    if (isDisableHour) {
      return setInValidTime(true)
    }

    const time = dayjs()
      .set('date', currentDate)
      .set('minute', parseInt(hourSelected?.includes(':30') ? '30' : '00', 10))
      .set('hour', parseInt(hourSelected, 10))
      .set('second', 0)
      .toDate()
    updateSchedule(time)
    navigate('RequestServeStack')
  }

  const onLayout = () => {
    if (currentDate > 7 && currentDate < 14 && refScrollDay.current) {
      refScrollDay?.current.scrollTo({
        x: Dimensions.get('window').width * 0.7,
        y: 0,
        animated: true,
      })
    } else if (currentDate >= 14 && currentDate < 21 && refScrollDay?.current) {
      refScrollDay?.current.scrollTo({
        x: Dimensions.get('window').width * 1.5,
        y: 0,
        animated: true,
      })
    } else if (currentDate >= 21 && currentDate < 28) {
      refScrollDay?.current?.scrollTo({
        x: Dimensions.get('window').width * 2.8,
        y: 0,
        animated: true,
      })
    } else if (currentDate > 28) {
      refScrollDay?.current?.scrollTo({
        x: Dimensions.get('window').width * 3.7,
        y: 0,
        animated: true,
      })
    }
  }

  const renderDateTime = () => {
    return (
      <View>
        <ScrollView
          ref={refScrollDay}
          contentContainerStyle={styles.rowTime}
          horizontal
          onLayout={onLayout}
          showsHorizontalScrollIndicator={false}>
          {dayInMonth.map((e, i) => {
            const isActive = +currentDate === +e?.date
            const isDisableDate = +dayjs().get('date') > +e?.date
            return (
              <View style={styles.itemTime} key={i}>
                <CommonText text={e?.title} styles={styles.day} />
                <TouchableOpacity
                  disabled={isDisableDate}
                  style={[
                    styles.btDate,
                    {
                      backgroundColor: isActive ? Colors.main : Colors.white,
                    },
                  ]}
                  onPress={onPressDate(e?.date)}>
                  <CommonText
                    text={`${+e?.date < 10 ? '0' + e?.date : e?.date}`}
                    styles={{
                      ...styles.date,
                      color: isActive
                        ? Colors.white
                        : isDisableDate
                        ? Colors.nobel
                        : Colors.textSecondary,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  const renderHours = () => {
    return (
      <View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.listHour}
          contentContainerStyle={styles.wrapperHours}>
          {hours.map((hour, index) => {
            const isSelected = hourSelected === hour
            // const isDisableHour = dayjs(
            //   `${currentDate} ${hour}`,
            //   'DD HH:mm',
            // ).isBefore(dayjs())
            return (
              <TouchableOpacity
                // disabled={isDisableHour}
                hitSlop={{top: 20, bottom: 20, left: 10, right: 10}}
                style={{
                  ...styles.itemHour,
                  ...(isSelected && {backgroundColor: Colors.main}),
                }}
                key={index}
                onPress={onPressHour(hour)}>
                <CommonText
                  text={hour}
                  styles={{
                    ...styles.hour,
                    ...(isSelected && {color: Colors.white}),
                  }}
                />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  const getDaysInMonth = () => {
    const monthData: ItemDate[] = []
    const month = dayjs().month()
    const startDate = dayjs().month(month).startOf('month')
    const endDate = dayjs().month(month).endOf('month')

    let crDate = startDate

    while (crDate.isBefore(endDate.add(1, 'day'), 'day')) {
      const dayObject = {
        title: convertDayToVN(crDate.format('dddd')?.toLocaleLowerCase()) || '',
        date: crDate.date(),
      }
      monthData.push(dayObject)
      crDate = crDate.add(1, 'day')
    }
    setDayInMonth(monthData)
  }

  const getTime = () => {
    const newHours: string[] = []
    for (let i = 6.5; i <= 19; i += 0.5) {
      newHours.push(`${i}`.includes('.5') ? `${i - 0.5}:30` : `${i}:00`)
    }
    setHours(newHours)
  }

  useEffect(() => {
    getDaysInMonth()
    getTime()
  }, [])

  return (
    <View style={styles.container}>
      <Header title="Chọn thời gian đặt lịch" />
      <View style={styles.wrapper}>
        <CommonText
          text={`Tháng ${dayjs().format('MM-YYYY')}`}
          styles={styles.dateTime}
        />
        {renderDateTime()}
        {renderHours()}
        {inValidTime && (
          <CommonText
            text="Vui lòng chọn thời gian lớn hơn hiện tại"
            styles={styles.error}
          />
        )}
      </View>
      <CommonButton
        isDisable={!hourSelected}
        text="Tiếp tục"
        buttonStyles={styles.btContinue}
        onPress={onPressContinue}
      />
    </View>
  )
}

export default Schedule
