import {Colors} from 'assets/Colors'
import React, {useEffect, useRef, useState} from 'react'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import CommonText from './CommonText'
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet'

const styles = StyleSheet.create({
  container: {
    height: 500,
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'flex-start',
    width: '100%',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  searchInput: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    width: '100%',
    color: Colors.textPrimary,
  },
  textNotFound: {
    paddingVertical: 16,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  actionSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  wrapperInput: {
    height: 48,
    width: Dimensions.get('screen').width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.border,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
  },
  labelInput: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  required: {
    color: Colors.red,
    marginTop: 2,
  },
})

interface ListBankProps {
  onSelectBankValue: (value: string) => void
  bankName: string
}

const ListBank: React.FC<ListBankProps> = ({onSelectBankValue, bankName}) => {
  const [bankSelected, setBankSelected] = useState('')
  useEffect(() => {
    setBankSelected(bankName)
  }, [bankName])

  const onSelectBank = (bank) => {
    setBankSelected(bank.name)
    onSelectBankValue(bank.name)
    actionSheetRef?.current?.hide()
  }
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const onCloseActionSheet = () => {
    actionSheetRef?.current?.hide()
  }

  const banks = [
    {id: '1', name: 'TMCP Việt Nam Thịnh Vượng (VPBank)'},
    {id: '2', name: 'TMCP Đầu tư và Phát triển Việt Nam (BIDV)'},
    {id: '3', name: 'TMCP Ngoại Thương Việt Nam (Vietcombank)'},
    {id: '4', name: 'TMCP Công thương Việt Nam (VietinBank)'},
    {id: '5', name: 'TMCP Quân Đội (MBBANK)'},
    {id: '6', name: 'TMCP Á Châu (ACB)'},
    {id: '7', name: 'TMCP Sài Gòn – Hà Nội (SHB)'},
    {id: '8', name: 'TMCP Kỹ Thương (Techcombank)'},
    {id: '9', name: 'NN&PT Nông thôn Việt Nam (Agribank)'},
    {id: '10', name: 'TMCP Phát triển Thành phố Hồ Chí Minh (HDBank)'},
    {id: '11', name: 'TMCP Bưu điện Liên Việt (LienVietPostBank)'},
    {id: '12', name: 'TMCP Quốc Tế (VIB)'},
    {id: '13', name: 'TMCP Đông Nam Á (SeABank)'},
    {id: '14', name: 'Chính sách xã hội Việt Nam (VBSP)'},
    {id: '15', name: 'TMCP Tiên Phong (TPBank)'},
    {id: '16', name: 'TMCP Phương Đông (OCB)'},
    {id: '17', name: 'TMCP Hàng Hải (MSB)'},
    {id: '18', name: 'TMCP Sài Gòn Thương Tín (Sacombank)'},
    {id: '19', name: 'TMCP Xuất Nhập Khẩu (Eximbank)'},
    {id: '20', name: 'TMCP Sài Gòn (SCB)'},
    {id: '21', name: 'Phát triển Việt Nam (VDB)'},
    {id: '22', name: 'TMCP Nam Á (Nam A Bank)'},
    {id: '23', name: 'TMCP An Bình (ABBANK)'},
    {id: '24', name: 'TMCP Đại Chúng Việt Nam (PVcomBank)'},
    {id: '25', name: 'TMCP Bắc Á (Bac A Bank)'},
    {id: '26', name: 'TNHH MTV UOB Việt Nam (UOB)'},
    {id: '27', name: 'TNHH MTV Woori Việt Nam (Woori)'},
    {id: '28', name: 'TNHH MTV HSBC Việt Nam (HSBC)'},
    {id: '29', name: 'TNHH MTV Standard Chartered Việt Nam (SCBVL)'},
    {id: '30', name: 'TNHH MTV Public Bank Việt Nam (PBVN)'},
    {id: '31', name: 'TNHH MTV Shinhan Việt Nam (SHBVN)'},
    {id: '32', name: 'TMCP Quốc dân (NCB)'},
    {id: '33', name: 'TMCP Việt Á (VietABank)'},
    {id: '34', name: 'TMCP Bản Việt (Viet Capital Bank)'},
    {id: '35', name: 'TMCP Đông Á (DongA Bank)'},
    {id: '36', name: 'TMCP Việt Nam Thương Tín (Vietbank)'},
    {id: '37', name: 'TNHH MTV ANZ Việt Nam (ANZVL)'},
    {id: '38', name: 'TNHH MTV Đại Dương (OceanBank)'},
    {id: '39', name: 'TNHH MTV CIMB Việt Nam (CIMB)'},
    {id: '40', name: 'TMCP Kiên Long (Kienlongbank)'},
    {id: '41', name: 'TNHH Indovina (IVB)'},
    {id: '42', name: 'TMCP Bảo Việt (BAOVIET Bank)'},
    {id: '43', name: 'TMCP Sài Gòn Công Thương (SAIGONBANK)'},
    {id: '44', name: 'Hợp tác xã Việt Nam (Co-opBank)'},
    {id: '45', name: 'TNHH MTV Dầu khí toàn cầu (GPBank)'},
    {id: '46', name: 'Liên doanh Việt Nga (VRB)'},
    {id: '47', name: 'TNHH MTV Xây dựng (CB)'},
    {id: '48', name: 'TNHH MTV Hong Leong Việt Nam (HLBVN)'},
    {id: '49', name: 'TMCP Xăng dầu Petrolimex (PG Bank)'},
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <View>
        <View style={styles.labelInput}>
          <CommonText text="Ngân hàng" />
          {/* <Text style={styles.required}> *</Text> */}
        </View>
        <TouchableOpacity
          style={styles.wrapperInput}
          onPress={() => actionSheetRef?.current?.show()}>
          <CommonText
            styles={styles.input}
            text={bankSelected !== '' ? bankSelected : 'Chọn ngân hàng'}
          />
        </TouchableOpacity>

        <ActionSheet
          ref={actionSheetRef}
          containerStyle={styles.actionSheet}
          onClose={onCloseActionSheet}>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm ngân hàng ..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {filteredBanks.length === 0 ? (
              <CommonText
                text="Không tìm thấy ngân hàng nào"
                styles={styles.textNotFound}
              />
            ) : (
              filteredBanks.map(bank => (
                <TouchableOpacity
                  key={bank.id}
                  style={styles.item}
                  onPress={() => onSelectBank(bank)}>
                  <CommonText text={bank.name} styles={styles.title} />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </ActionSheet>
      </View>
    </>
  )
}

export default ListBank
