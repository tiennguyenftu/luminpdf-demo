import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ListView
} from 'react-native';
import RNFS from 'react-native-fs';

let pdfFiles = [];

class FilePicker extends Component {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows(pdfFiles)
    };
  }

  openPDFFile = () => {
    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((result) => {
        const pdfFiles = result
          .map(item => {
          if (item.isFile() && item.path.includes('.pdf') > 0) {
            return item;
          }
          return null
        })
          .filter(item => item !== null);

        console.log('PDF Files', pdfFiles);
        this.setState({
          dataSource: this.ds.cloneWithRows(pdfFiles)
        });
      });
  };

  render() {
    const {dataSource} = this.state;
    if (pdfFiles && pdfFiles.length) {
      return (
        <ListView
          dataSource={dataSource()}
          renderRow={(item) => <Text>{item.name}</Text>}
        />
      );
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.openPDFFile}>
          <Text>Open File from File System</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default FilePicker;