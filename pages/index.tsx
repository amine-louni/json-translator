import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";
import { Controlled } from "react-codemirror2";
import axios from "axios";
import JSONPretty from "react-json-pretty";
import { AppButton } from "../components/AppButton";
import AppContainer from "../components/AppContainer";
import AppSelect from "../components/AppSelect";

const LIMIT = 12; // Max keys permitted by ms translator api via rapide api

const Home: NextPage = () => {
  const [json, setJson] = useState("");
  const [jsonTranslated, setJsonTranslated] = useState("");
  const [inputLng, setInputLng] = useState<null | {
    value: string;
    key: string;
  }>(null);
  const [targetLng, setTargetLng] = useState<null | {
    value: string;
    key: string;
  }>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState("");

  // according to ms trnslate free tier can translate ac chunk LIMIT items only
  const translateChunk = useCallback(
    async (chunk: string[]) => {
      if (chunk.length > LIMIT) {
        throw Error(`Can not pass ${LIMIT} item`);
      }

      // Rapid api request config
      const options = {
        params: {
          from: inputLng?.key,
          to: targetLng?.key,
          "api-version": "3.0",
          profanityAction: "NoAction",
          textType: "plain",
        },
        headers: {
          "content-type": "application/json",
          "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
          "x-rapidapi-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
      };

      // Formatting the chunk to an apprropriate object according to ms api [{Text:string}]
      const data = chunk.map((item) => {
        return {
          Text: item,
        };
      });

      const res = await axios.post(
        "https://microsoft-translator-text.p.rapidapi.com/translate",
        data,
        options
      );

      // returning array with translated strings
      return res.data.map(
        (oneTranslate: { translations: [{ text: string; to: string }] }) => {
          return oneTranslate.translations[0].text;
        }
      );
    },
    [inputLng?.key, targetLng?.key]
  );

  // create appropriate json format to display
  const fillData = (data: object) => {
    try {
      const stringData = JSON.stringify(data);
      setJsonTranslated(stringData);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Returns void
   *
   * @param {object} targetObject The text value to trnaslate
   * @param {function} callback Take the data:sring[] translated as an arguemnt
   */
  const main = useCallback(
    async (targetObject, callback) => {
      try {
        setLoading(true);
        setJsonTranslated("");
        const parsedTarget = JSON.parse(targetObject);
        let result: any = {}; // to collect translated
        const values: string[] = Object.values(parsedTarget);

        let allChunksValues = []; // all translated data pushed to this array

        if (values.length > LIMIT) {
          let currentChunkIndex = 0;
          let allChunksCount = Math.ceil(values.length / LIMIT);

          while (currentChunkIndex <= allChunksCount - 1) {
            let start = currentChunkIndex * LIMIT;
            let end = start + LIMIT;

            const chunk = values.slice(start, end);

            const translatedChunk = await translateChunk(chunk);
            allChunksValues.push(...translatedChunk);

            currentChunkIndex++;
          }

          // filling data,  api returned data as the order they were sent!
          let fillingIndex = 0;
          for (const property in parsedTarget) {
            result[property] = allChunksValues[fillingIndex];
            fillingIndex++;
          }

          callback(result);
        }
      } catch (error: any) {
        setErrors(error.name);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [translateChunk]
  );

  return (
    <>
      <Head>
        <title>Json translator</title>
      </Head>

      <main className="bg-slate-100">
        <nav className="bg-green-700 py-5 mb-5">
          <AppContainer>
            <h1 className="text-white font-semibold text-xl">
              🌐 Json translator online
            </h1>
          </AppContainer>
        </nav>

        <AppContainer className="bg-white p-5 mb-5">
          <h3 className="font-semibold mb-3 text-slate-600">
            👉 1 - Please input JSON.
          </h3>
          <div className="editor">
            <Controlled
              options={{
                mode: "javascript",
                theme: "seti",
                lineNumbers: true,
              }}
              value={json}
              onBeforeChange={(editor, data, value) => {
                setJson(value);
              }}
              onChange={(editor, data, value) => {
                console.log(editor, data, value);
              }}
            />
          </div>
        </AppContainer>

        <AppContainer className="bg-white p-5 mb-5">
          <div className="my-5">
            <h3 className="font-semibold mb-5 text-slate-600">
              👉 2 - Select source and target languages to translate.
            </h3>
            <div className="flex justify-between">
              <AppSelect
                title="Select source language"
                items={[
                  { key: "ar", value: "Arabe" },
                  { key: "en", value: "English" },
                ]}
                callback={(selectedLng) => setInputLng(selectedLng)}
              />
              <AppSelect
                title="Select target language"
                items={[
                  { key: "ar", value: "Arabe" },
                  { key: "en", value: "English" },
                ]}
                callback={(selectedLng) => setTargetLng(selectedLng)}
              />
            </div>
          </div>
        </AppContainer>

        <AppContainer className="bg-white p-5 mb-5">
          <h3 className="font-semibold text-slate-600">👉 3 - Translate!</h3>
          <div className="my-5">
            <AppButton
              disabled={!(targetLng && inputLng)}
              title="Translate"
              onPress={() => main(json, fillData)}
            />
          </div>
        </AppContainer>

        <AppContainer className="bg-white p-5 mb-5">
          <div className="editor">
            {jsonTranslated ? (
              <JSONPretty
                data={jsonTranslated}
                theme={require("react-json-pretty/dist/monikai")}
              />
            ) : (
              <>
                <h3 className="font-semibold text-slate-600">
                  👉 Output will appear here after transalting
                </h3>
              </>
            )}
          </div>
        </AppContainer>
      </main>
    </>
  );
};

export default Home;
