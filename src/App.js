import React, {Component} from 'react';
import FilePicker from './pages/file-picker/FilePicker';

// export default class App extends Component {
//   render() {
//     return (
//       <FilePicker/>
//     );
//   }
// }

import {
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  View,
  Text
} from 'react-native';

import Pdf from 'react-native-pdf';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';

export default class PDFExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageCount: 1,
      source: {uri:'https://www.irs.gov/pub/irs-pdf/fw2.pdf',cache:false},
      count: 0
    };
    this.pdf = null;
  }

  createPDF = async () => {
    const page1 = PDFPage
      .create()
      .setMediaBox(200, 200)
      .drawText('You can add text and rectangles to the PDF!', {
        x: 5,
        y: 235,
        color: '#007386',
        fontWeight: 'italic',
        fontSize: 30
      })
      .drawRectangle({
        x: 75,
        y: 75,
        width: 300,
        height: 1,
        color: '#99FFCC',
      });

    const page2 = PDFPage
      .create()
      .setMediaBox(200, 200)
      .drawText('You can add new pages to a modified PDF as well!', {
        x: 235,
        y: 235,
        color: 'red',
      });

// Create a PDF page with text and an image

// Create a new PDF in your app's private Documents directory
    const docsDir = await PDFLib.getDocumentsDirectory();
    const pdfPath = `${docsDir}/sample.pdf`;
    PDFDocument
      .create(pdfPath)
      .addPages(page1, page2)
      .write() // Returns a promise that resolves with the PDF's path
      .then(path => {
        console.log('PDF created at: ' + path);
        this.setState({
          source: {
            uri: path,
            cache: false
          }
        })
        // Do stuff with your shiny new PDF!
      });
  };

  modifyPDF = (existingPDF) => {
    // Modify first page in document
    this.setState({
      count: this.state.count + 1
    });

    const page1 = PDFPage
      .modify(0)
      .drawText('This is a modification on the first page!', {
        x: 5,
        y: 235,
        color: '#F62727',
      })
      .drawRectangle({
        x: 150,
        y: 1,
        width: 50,
        height: 50,
        color: '#81C744',
      });

    console.log('page1', page1);

    // Create a PDF page to add to document
    const page2 = PDFPage
      .create()
      .setMediaBox(200, 200)
      .drawText('You can add new pages to a modified PDF as well!', {
        x: 235,
        y: 235,
        color: 'red',
      });

// Create a PDF page to add to document
    console.log('existingPDF', existingPDF);
      PDFDocument
        .modify(existingPDF)
        .modifyPage(page1)
        .addPage(page2)
        .write() // Returns a promise that resolves with the PDF's path
        .then(path => {
          console.log('PDF modified at: ' + path);
          this.setState({
            source: {
              uri: path,
              cache: false
            }
          });
        });
  };

  componentDidMount() {
    // this.createPDF().then(() => console.log('Done'));

  }

  shouldComponentUpdate() {
    return true;
  }

  prePage=()=>{
    if (this.pdf){
      let prePage = this.state.page>1?this.state.page-1:1;
      this.pdf.setNativeProps({page: prePage});
      this.setState({page:prePage});
      console.log(`prePage: ${prePage}`);
    }
  };

  nextPage=()=>{
    if (this.pdf){
      let nextPage = this.state.page+1>this.state.pageCount?this.state.pageCount:this.state.page+1;
      this.pdf.setNativeProps({page: nextPage});
      this.setState({page:nextPage});
      console.log(`nextPage: ${nextPage}`);
    }

  };

  render() {
    let source = this.state.source;

    if (source) {
      return (
        <View style={styles.container}>
          <View style={{flexDirection:'row'}}>
            <TouchableHighlight  disabled={this.state.page==1} style={this.state.page==1?styles.btnDisable:styles.btn} onPress={()=>this.prePage()}>
              <Text style={styles.btnText}>{'Previous'}</Text>
            </TouchableHighlight>
            <TouchableHighlight  disabled={this.state.page==this.state.pageCount} style={this.state.page==this.state.pageCount?styles.btnDisable:styles.btn}  onPress={()=>this.nextPage()}>
              <Text style={styles.btnText}>{'Next'}</Text>
            </TouchableHighlight>
            <TouchableHighlight  onPress={()=>this.modifyPDF(this.state.source.uri)}>
              <Text style={styles.btnText}>{'Edit'}</Text>
            </TouchableHighlight>
            <TouchableHighlight  onPress={()=>this.createPDF()}>
              <Text style={styles.btnText}>{'Load'}</Text>
            </TouchableHighlight>
          </View>
          <Pdf ref={(pdf)=>{this.pdf = pdf;}}
               source={source}
               page={1}
               horizontal={false}
               onLoadComplete={(pageCount)=>{
                 this.setState({pageCount: pageCount});
                 console.log(`total page count: ${pageCount}`);
               }}
               onPageChanged={(page,pageCount)=>{
                 this.setState({page:page});
                 console.log(`current page: ${page}`);
               }}
               onError={(error)=>{
                 console.log(error);
               }}
               style={styles.pdf}/>
        </View>
      )
    }

    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  btn: {
    margin: 5,
    padding:5,
    backgroundColor: "blue",
  },
  btnDisable: {
    margin: 5,
    padding:5,
    backgroundColor: "gray",
  },
  btnText: {
    color: "#000",
  },
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
  }
});